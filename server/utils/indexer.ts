import { getXrplClient, getAdminWallet } from './xrpl';
import { prisma } from './prisma';

/**
 * Indexer: synchronise les transactions on-chain avec la base de données.
 * Interroge account_tx du wallet admin et enregistre les nouvelles transactions.
 */
export const runIndexer = async () => {
    try {
        const client = await getXrplClient();
        let adminWallet;
        try {
            adminWallet = getAdminWallet();
        } catch {
            console.log('[Indexer] XRPL_ADMIN_SEED non configurée, indexer désactivé');
            return;
        }

        // Récupérer les transactions récentes du wallet admin
        const response = await client.request({
            command: 'account_tx',
            account: adminWallet.address,
            limit: 50,
            forward: false,
        });

        const transactions = response.result.transactions || [];

        for (const tx of transactions) {
            const txData = tx.tx_json || tx.tx;
            if (!txData) continue;

            const hash = txData.hash || (tx as any).hash;
            if (!hash) continue;

            // Vérifier si la transaction est déjà en base
            const existing = await prisma.transaction.findUnique({
                where: { xrplTxHash: hash },
            });

            if (existing) continue;

            // Déterminer le type de transaction
            const txType = txData.TransactionType;
            let type = 'UNKNOWN';
            let assetType = 'XRP';
            let assetId = 'XRP';
            let amount = '0';

            if (txType === 'Payment') {
                type = txData.Account === adminWallet.address ? 'PAYMENT_OUT' : 'PAYMENT_IN';
                if (typeof txData.Amount === 'string') {
                    amount = (Number(txData.Amount) / 1_000_000).toString();
                } else if (txData.Amount && typeof txData.Amount === 'object') {
                    amount = (txData.Amount as any).value || '0';
                    assetType = 'TOKEN';
                    assetId = (txData.Amount as any).currency || 'UNKNOWN';
                }
            } else if (txType === 'NFTokenMint') {
                type = 'NFT_MINT';
                assetType = 'NFT';
            } else if (txType === 'NFTokenCreateOffer') {
                type = 'NFT_OFFER';
                assetType = 'NFT';
                assetId = (txData as any).NFTokenID || 'UNKNOWN';
            } else if (txType === 'NFTokenAcceptOffer') {
                type = 'NFT_ACCEPT';
                assetType = 'NFT';
            } else if (txType === 'TrustSet') {
                type = 'TRUST_SET';
                assetType = 'TOKEN';
            } else if (txType === 'AMMCreate') {
                type = 'AMM_CREATE';
            } else if (txType === 'AMMDeposit') {
                type = 'AMM_DEPOSIT';
            }

            // Chercher l'utilisateur correspondant
            const userAddress = txData.Account === adminWallet.address
                ? (txData as any).Destination
                : txData.Account;

            let userId = null;
            if (userAddress) {
                const user = await prisma.user.findUnique({
                    where: { walletAddress: userAddress },
                });
                userId = user?.id || null;
            }

            // Si on n'a pas d'userId, on utilise un userId par défaut (admin=1 ou on skip)
            if (userId === null) continue;

            await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    assetType,
                    assetId,
                    amount,
                    xrplTxHash: hash,
                    counterparty: txData.Account === adminWallet.address
                        ? (txData as any).Destination || null
                        : txData.Account,
                },
            }).catch(() => {
                // Ignorer les doublons
            });
        }

        // Indexer les NFTs: synchroniser la propriété
        try {
            const nftsResponse = await client.request({
                command: 'account_nfts',
                account: adminWallet.address,
            });

            const onchainNfts = nftsResponse.result.account_nfts || [];

            for (const nft of onchainNfts) {
                await prisma.nftAsset.updateMany({
                    where: {
                        nftokenId: nft.NFTokenID,
                        ownerId: { not: null },
                    },
                    data: {
                        ownerId: null, // Le NFT est revenu chez l'issuer
                    },
                }).catch(() => { });
            }
        } catch {
            // Ignorer les erreurs de NFT indexing
        }

        console.log(`[Indexer] Synchronisation terminée: ${transactions.length} transactions traitées`);
    } catch (error) {
        console.error('[Indexer] Erreur:', error);
    }
};
