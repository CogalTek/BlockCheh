import { requireAuth } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireAuth(event);

    const kycRequest = await prisma.kycRequest.findUnique({
        where: { userId: dbUser.id },
    });

    return {
        status: kycRequest?.status || 'NONE',
        isWhitelisted: dbUser.isWhitelisted,
        isBlacklisted: dbUser.isBlacklisted,
        walletAddress: dbUser.walletAddress,
        kycRequest,
    };
});
