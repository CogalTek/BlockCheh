import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';

/**
 * Synchronise les NFTs on-chain (account_nfts) avec la base de données.
 * Crée les entrées manquantes pour les NFTs qui existent sur le ledger mais pas en DB.
 */
export default defineEventHandler(async (event) => {
    await requireAdmin(event);

    const client = await getXrplClient();
    const adminWallet = getAdminWallet();

    // Récupérer tous les NFTs du wallet admin sur XRPL
    const response = await client.request({
        command: 'account_nfts',
        account: adminWallet.address,
    });

    const onchainNfts = response.result.account_nfts || [];
    let created = 0;
    let alreadyExists = 0;

    for (const nft of onchainNfts) {
        // Vérifier si le NFT est déjà en base
        const existing = await prisma.nftAsset.findUnique({
            where: { nftokenId: nft.NFTokenID },
        });

        if (existing) {
            alreadyExists++;
            continue;
        }

        // Essayer de décoder les métadonnées depuis l'URI
        let name = `NFT ${nft.NFTokenID.substring(0, 8)}`;
        let description = null;
        let category = 'historique';

        if (nft.URI) {
            try {
                const decoded = Buffer.from(nft.URI, 'hex').toString('utf-8');
                const metadata = JSON.parse(decoded);
                name = metadata.name || name;
                description = metadata.description || null;
                category = metadata.category || 'historique';
            } catch {
                // URI pas décodable, on garde les valeurs par défaut
            }
        }

        await prisma.nftAsset.create({
            data: {
                nftokenId: nft.NFTokenID,
                name,
                description,
                category,
                mintedBy: 0,
            },
        });

        created++;
    }

    return {
        success: true,
        message: `Synchronisation terminée: ${created} NFTs ajoutés, ${alreadyExists} déjà en base`,
        totalOnChain: onchainNfts.length,
        created,
        alreadyExists,
    };
});
