import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { submitTransaction } from '../../utils/submitTx';
import { AMMCreate, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.currencyCode || !body.tokenAmount || !body.xrpAmount) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode, tokenAmount et xrpAmount requis' });
    }

    const client = await getXrplClient();
    const adminWallet = getAdminWallet();
    const currencyCode = body.currencyCode.toUpperCase();

    // Créer le pool AMM
    const ammCreateTx: AMMCreate = {
        TransactionType: 'AMMCreate',
        Account: adminWallet.address,
        Amount: {
            currency: currencyCode,
            issuer: adminWallet.address,
            value: String(body.tokenAmount),
        },
        Amount2: String(Math.round(parseFloat(body.xrpAmount) * 1_000_000)), // XRP en drops
        TradingFee: body.tradingFee || 500, // 0.5% par défaut
    };

    const result = await submitTransaction(client, ammCreateTx as any, adminWallet);

    return {
        success: true,
        txHash: result.result.hash,
        message: `Pool AMM créé: ${body.tokenAmount} ${currencyCode} / ${body.xrpAmount} XRP`,
    };
});
