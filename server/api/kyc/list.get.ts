import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);

    const query = getQuery(event);
    const statusFilter = query.status as string | undefined;

    const where = statusFilter ? { status: statusFilter as any } : {};

    const kycRequests = await prisma.kycRequest.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    walletAddress: true,
                    isWhitelisted: true,
                    isBlacklisted: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return { kycRequests };
});
