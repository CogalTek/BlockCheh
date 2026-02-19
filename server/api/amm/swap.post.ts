import { requireWhitelisted } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { Payment, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireWhitelisted(event);
    const body = await readBody(event);

    if (!body.currencyCode || !body.amount || !body.direction) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode, amount et direction (buy/sell) requis' });
    }

    if (!dbUser.walletSeed) {
        throw createError({ statusCode: 400, statusMessage: 'Wallet non configuré' });
    }

    const client = await getXrplClient();
    const userWallet = Wallet.fromSeed(dbUser.walletSeed);
    const adminWallet = getAdminWallet();
    const currencyCode = body.currencyCode.toUpperCase();

    let paymentTx: Payment;

    if (body.direction === 'buy') {
        // Acheter des tokens avec XRP
        paymentTx = {
            TransactionType: 'Payment',
            Account: userWallet.address,
            Destination: userWallet.address,
            Amount: {
                currency: currencyCode,
                issuer: adminWallet.address,
                value: body.amount,
            },
            SendMax: String(Math.round(parseFloat(body.maxXrp || '999999') * 1_000_000)),
        };
    } else {
        // Vendre des tokens pour XRP
        paymentTx = {
            TransactionType: 'Payment',
            Account: userWallet.address,
            Destination: userWallet.address,
            Amount: String(Math.round(parseFloat(body.minXrp || '1') * 1_000_000)),
            SendMax: {
                currency: currencyCode,
                issuer: adminWallet.address,
                value: body.amount,
            },
        };
    }

    const prepared = await client.autofill(paymentTx);
    const signed = userWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    // Enregistrer la transaction
    await prisma.transaction.create({
        data: {
            userId: dbUser.id,
            type: body.direction === 'buy' ? 'AMM_BUY' : 'AMM_SELL',
            assetType: 'TOKEN',
            assetId: currencyCode,
            amount: body.amount,
            xrplTxHash: result.result.hash,
        },
    });

    return {
        success: true,
        txHash: result.result.hash,
        direction: body.direction,
        amount: body.amount,
        currency: currencyCode,
    };
});
