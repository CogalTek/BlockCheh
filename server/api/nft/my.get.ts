import { requireAuth } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireAuth(event);

    const nfts = await prisma.nftAsset.findMany({
        where: { ownerId: dbUser.id },
        orderBy: { createdAt: 'desc' },
    });

    return { nfts };
});
