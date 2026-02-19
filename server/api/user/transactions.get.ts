import { requireAuth } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireAuth(event);

    const query = getQuery(event);
    const limit = Math.min(parseInt(query.limit as string) || 20, 100);

    const transactions = await prisma.transaction.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });

    return { transactions };
});
