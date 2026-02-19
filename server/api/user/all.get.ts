import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            walletAddress: true,
            isWhitelisted: true,
            isBlacklisted: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return { users };
});
