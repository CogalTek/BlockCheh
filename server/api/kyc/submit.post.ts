import { requireAuth } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { Wallet } from 'xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireAuth(event);
    const body = await readBody(event);

    if (!body.fullName || !body.documentId) {
        throw createError({ statusCode: 400, statusMessage: 'fullName et documentId requis' });
    }

    // Vérifier s'il y a déjà une demande KYC
    const existing = await prisma.kycRequest.findUnique({
        where: { userId: dbUser.id },
    });

    if (existing) {
        throw createError({ statusCode: 409, statusMessage: 'Une demande KYC existe déjà' });
    }

    // Générer un wallet XRPL pour l'utilisateur s'il n'en a pas
    let walletAddress = dbUser.walletAddress;
    let walletSeed = dbUser.walletSeed;

    if (!walletAddress) {
        const wallet = Wallet.generate();
        walletAddress = wallet.address;
        walletSeed = wallet.seed;

        await prisma.user.update({
            where: { id: dbUser.id },
            data: {
                walletAddress: wallet.address,
                walletSeed: wallet.seed,
            },
        });
    }

    // Créer la demande KYC
    const kycRequest = await prisma.kycRequest.create({
        data: {
            userId: dbUser.id,
            fullName: body.fullName,
            documentId: body.documentId,
        },
    });

    return {
        success: true,
        kycRequest,
        walletAddress,
    };
});
