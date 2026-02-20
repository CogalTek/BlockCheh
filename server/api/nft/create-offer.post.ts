import { requireWhitelisted } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient } from '../../utils/xrpl';
import { NFTokenCreateOffer, NFTokenCreateOfferFlags, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireWhitelisted(event);
    const body = await readBody(event);

    if (!body.nftokenId || !body.amount) {
        throw createError({ statusCode: 400, statusMessage: 'nftokenId et amount requis' });
    }

    if (!dbUser.walletSeed) {
        throw createError({ statusCode: 400, statusMessage: 'Wallet non configuré' });
    }

    const client = await getXrplClient();
    const wallet = Wallet.fromSeed(dbUser.walletSeed);

    // Créer une offre de vente
    const offerTx: NFTokenCreateOffer = {
        TransactionType: 'NFTokenCreateOffer',
        Account: wallet.address,
        NFTokenID: body.nftokenId,
        Amount: String(Math.round(parseFloat(body.amount) * 1_000_000)), // Convertir en drops
        Flags: NFTokenCreateOfferFlags.tfSellNFToken,
    };

    if (body.destination) {
        offerTx.Destination = body.destination;
    }

    const prepared = await client.autofill(offerTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    // Enregistrer la transaction
    await prisma.transaction.create({
        data: {
            userId: dbUser.id,
            type: 'NFT_SELL_OFFER',
            assetType: 'NFT',
            assetId: body.nftokenId,
            amount: String(body.amount),
            xrplTxHash: result.result.hash,
        },
    });

    return {
        success: true,
        txHash: result.result.hash,
    };
});
