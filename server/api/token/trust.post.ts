import { requireWhitelisted } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { submitTransaction } from '../../utils/submitTx';
import { TrustSet, Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireWhitelisted(event);
    const body = await readBody(event);

    if (!body.currencyCode) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode requis' });
    }

    // Vérifier que le token existe
    const token = await prisma.fungibleToken.findUnique({
        where: { currencyCode: body.currencyCode.toUpperCase() },
    });

    if (!token) {
        throw createError({ statusCode: 404, statusMessage: 'Token non trouvé' });
    }

    if (!dbUser.walletSeed) {
        throw createError({ statusCode: 400, statusMessage: 'Wallet non configuré' });
    }

    const client = await getXrplClient();
    const userWallet = Wallet.fromSeed(dbUser.walletSeed);
    const adminWallet = getAdminWallet();

    // Établir une trust line
    const trustTx: TrustSet = {
        TransactionType: 'TrustSet',
        Account: userWallet.address,
        LimitAmount: {
            currency: token.currencyCode,
            issuer: adminWallet.address,
            value: body.limit || '1000000', // Limite par défaut
        },
    };

    const result = await submitTransaction(client, trustTx as any, userWallet);

    // Enregistrer la transaction
    await prisma.transaction.create({
        data: {
            userId: dbUser.id,
            type: 'TRUST_SET',
            assetType: 'TOKEN',
            assetId: token.currencyCode,
            amount: body.limit || '1000000',
            xrplTxHash: result.result.hash,
        },
    });

    return {
        success: true,
        txHash: result.result.hash,
        message: `Trust line établie pour ${token.currencyCode}`,
    };
});
