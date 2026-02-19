import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { TrustSet } from 'xrpl';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.kycRequestId) {
        throw createError({ statusCode: 400, statusMessage: 'kycRequestId requis' });
    }

    const kycRequest = await prisma.kycRequest.findUnique({
        where: { id: body.kycRequestId },
        include: { user: true },
    });

    if (!kycRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Demande KYC non trouvée' });
    }

    if (kycRequest.status !== 'PENDING') {
        throw createError({ statusCode: 400, statusMessage: 'Cette demande a déjà été traitée' });
    }

    // Approuver en base de données
    await prisma.$transaction([
        prisma.kycRequest.update({
            where: { id: kycRequest.id },
            data: { status: 'APPROVED' },
        }),
        prisma.user.update({
            where: { id: kycRequest.userId },
            data: { isWhitelisted: true },
        }),
    ]);

    return {
        success: true,
        message: `KYC approuvé pour ${kycRequest.fullName}`,
        walletAddress: kycRequest.user.walletAddress,
    };
});
