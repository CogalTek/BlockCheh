import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { NFTokenMint, NFTokenMintFlags, convertStringToHex } from 'xrpl';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.name) {
        throw createError({ statusCode: 400, statusMessage: 'name requis' });
    }

    let client;
    let adminWallet;

    try {
        client = await getXrplClient();
    } catch (e: any) {
        console.error('[NFT Mint] Erreur connexion XRPL:', e.message);
        throw createError({ statusCode: 500, statusMessage: `Connexion XRPL échouée: ${e.message}` });
    }

    try {
        adminWallet = getAdminWallet();
    } catch (e: any) {
        console.error('[NFT Mint] Erreur wallet:', e.message);
        throw createError({ statusCode: 500, statusMessage: e.message });
    }

    // Préparer les métadonnées du NFT
    const metadata = JSON.stringify({
        name: body.name,
        description: body.description || '',
        category: body.category || 'historique',
        imageUrl: body.imageUrl || '',
    });

    const uri = convertStringToHex(metadata);

    // Mint le NFT sur XRPL
    const mintTx: NFTokenMint = {
        TransactionType: 'NFTokenMint',
        Account: adminWallet.address,
        URI: uri,
        Flags: NFTokenMintFlags.tfTransferable | NFTokenMintFlags.tfOnlyXRP,
        NFTokenTaxon: 0,
        TransferFee: 500, // 5% de royalties
    };

    let result;
    try {
        const prepared = await client.autofill(mintTx);
        const signed = adminWallet.sign(prepared);
        result = await client.submitAndWait(signed.tx_blob);
    } catch (e: any) {
        console.error('[NFT Mint] Erreur transaction XRPL:', e.message, e.data);
        throw createError({
            statusCode: 500,
            statusMessage: `Transaction XRPL échouée: ${e.message}. Vérifie que le wallet admin est financé sur le testnet.`,
        });
    }

    // Extraire le NFTokenID depuis les métadonnées de la transaction
    const meta = result.result.meta as any;
    let nftokenId = '';

    if (meta?.nftoken_id) {
        nftokenId = meta.nftoken_id;
    } else if (meta?.AffectedNodes) {
        for (const node of meta.AffectedNodes) {
            const fields = node.CreatedNode?.NewFields || node.ModifiedNode?.FinalFields;
            if (fields?.NFTokens) {
                const tokens = fields.NFTokens;
                if (tokens.length > 0) {
                    nftokenId = tokens[tokens.length - 1].NFToken.NFTokenID;
                }
            }
        }
    }

    // Sauvegarder en base de données
    const nftAsset = await prisma.nftAsset.create({
        data: {
            nftokenId: nftokenId || `pending_${Date.now()}`,
            name: body.name,
            description: body.description || null,
            imageUrl: body.imageUrl || null,
            category: body.category || 'historique',
            mintedBy: 0, // admin
            priceXrp: body.priceXrp ? String(body.priceXrp) : null,
            xrplTxHash: result.result.hash,
        },
    });

    return {
        success: true,
        nft: nftAsset,
        txHash: result.result.hash,
        nftokenId,
    };
});
