import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { Payment, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.currencyCode || !body.destination || !body.amount) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode, destination et amount requis' });
    }

    // Vérifier que le destinataire est whitelisté
    const recipient = await prisma.user.findUnique({
        where: { walletAddress: body.destination },
    });

    if (recipient && (recipient.isBlacklisted || !recipient.isWhitelisted)) {
        throw createError({ statusCode: 403, statusMessage: 'Le destinataire n\'est pas whitelisté' });
    }

    const client = await getXrplClient();
    const adminWallet = getAdminWallet();
    const currencyCode = body.currencyCode.toUpperCase();

    // L'issuer envoie les tokens au destinataire
    const paymentTx: Payment = {
        TransactionType: 'Payment',
        Account: adminWallet.address,
        Destination: body.destination,
        Amount: {
            currency: currencyCode,
            issuer: adminWallet.address,
            value: body.amount,
        },
    };

    const prepared = await client.autofill(paymentTx);
    const signed = adminWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return {
        success: true,
        txHash: result.result.hash,
        message: `${body.amount} ${currencyCode} distribués à ${body.destination}`,
    };
});
