import { requireWhitelisted } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { Payment, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireWhitelisted(event);
    const body = await readBody(event);

    if (!body.currencyCode || !body.destination || !body.amount) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode, destination et amount requis' });
    }

    // Vérifier que le destinataire est whitelisté
    const recipient = await prisma.user.findUnique({
        where: { walletAddress: body.destination },
    });

    if (!recipient) {
        throw createError({ statusCode: 404, statusMessage: 'Destinataire non trouvé' });
    }

    if (recipient.isBlacklisted || !recipient.isWhitelisted) {
        throw createError({ statusCode: 403, statusMessage: 'Le destinataire n\'est pas whitelisté' });
    }

    if (!dbUser.walletSeed) {
        throw createError({ statusCode: 400, statusMessage: 'Wallet non configuré' });
    }

    const client = await getXrplClient();
    const senderWallet = Wallet.fromSeed(dbUser.walletSeed);
    const adminWallet = getAdminWallet();

    const currencyCode = body.currencyCode.toUpperCase();

    // Transfert via Payment
    const paymentTx: Payment = {
        TransactionType: 'Payment',
        Account: senderWallet.address,
        Destination: body.destination,
        Amount: {
            currency: currencyCode,
            issuer: adminWallet.address,
            value: String(body.amount),
        },
    };

    const prepared = await client.autofill(paymentTx);
    const signed = senderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    // Enregistrer les transactions pour les deux parties
    await prisma.transaction.createMany({
        data: [
            {
                userId: dbUser.id,
                type: 'TOKEN_SEND',
                assetType: 'TOKEN',
                assetId: currencyCode,
                amount: `-${String(body.amount)}`,
                xrplTxHash: result.result.hash,
                counterparty: body.destination,
            },
            {
                userId: recipient.id,
                type: 'TOKEN_RECEIVE',
                assetType: 'TOKEN',
                assetId: currencyCode,
                amount: String(body.amount),
                xrplTxHash: `${result.result.hash}_recv`,
                counterparty: senderWallet.address,
            },
        ],
    });

    return {
        success: true,
        txHash: result.result.hash,
        message: `${body.amount} ${currencyCode} envoyés à ${body.destination}`,
    };
});
