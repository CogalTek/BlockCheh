import { requireWhitelisted } from '../../utils/authGuard';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { AMMDeposit, AMMDepositFlags, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireWhitelisted(event);
    const body = await readBody(event);

    if (!body.currencyCode) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode requis' });
    }

    if (!dbUser.walletSeed) {
        throw createError({ statusCode: 400, statusMessage: 'Wallet non configuré' });
    }

    const client = await getXrplClient();
    const userWallet = Wallet.fromSeed(dbUser.walletSeed);
    const adminWallet = getAdminWallet();
    const currencyCode = body.currencyCode.toUpperCase();

    const ammDepositTx: AMMDeposit = {
        TransactionType: 'AMMDeposit',
        Account: userWallet.address,
        Asset: {
            currency: currencyCode,
            issuer: adminWallet.address,
        },
        Asset2: { currency: 'XRP' },
        Flags: AMMDepositFlags.tfTwoAsset,
    };

    // Dépôt bi-asset
    if (body.tokenAmount) {
        (ammDepositTx as any).Amount = {
            currency: currencyCode,
            issuer: adminWallet.address,
            value: body.tokenAmount,
        };
    }

    if (body.xrpAmount) {
        (ammDepositTx as any).Amount2 = String(Math.round(parseFloat(body.xrpAmount) * 1_000_000));
    }

    const prepared = await client.autofill(ammDepositTx);
    const signed = userWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return {
        success: true,
        txHash: result.result.hash,
        message: 'Dépôt AMM effectué',
    };
});
