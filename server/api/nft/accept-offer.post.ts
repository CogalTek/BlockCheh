import { requireWhitelisted } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient } from '../../utils/xrpl';
import { NFTokenAcceptOffer, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireWhitelisted(event);
    const body = await readBody(event);

    if (!body.offerId) {
        throw createError({ statusCode: 400, statusMessage: 'offerId requis' });
    }

    if (!dbUser.walletSeed) {
        throw createError({ statusCode: 400, statusMessage: 'Wallet non configuré' });
    }

    const client = await getXrplClient();
    const wallet = Wallet.fromSeed(dbUser.walletSeed);

    // Accepter l'offre
    const acceptTx: NFTokenAcceptOffer = {
        TransactionType: 'NFTokenAcceptOffer',
        Account: wallet.address,
        NFTokenSellOffer: body.offerId,
    };

    const prepared = await client.autofill(acceptTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    // Mettre à jour le propriétaire en base si on a le NFTokenID
    if (body.nftokenId) {
        await prisma.nftAsset.update({
            where: { nftokenId: body.nftokenId },
            data: { ownerId: dbUser.id },
        }).catch(() => {
            // NFT pas encore en base, on ignore
        });
    }

    // Enregistrer la transaction
    await prisma.transaction.create({
        data: {
            userId: dbUser.id,
            type: 'NFT_BUY',
            assetType: 'NFT',
            assetId: body.nftokenId || body.offerId,
            amount: body.amount || '0',
            xrplTxHash: result.result.hash,
        },
    });

    return {
        success: true,
        txHash: result.result.hash,
    };
});
