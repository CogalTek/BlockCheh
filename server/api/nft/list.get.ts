import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const category = query.category as string | undefined;

    const where = category ? { category } : {};

    const nfts = await prisma.nftAsset.findMany({
        where,
        include: {
            owner: {
                select: { id: true, name: true, email: true, walletAddress: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return { nfts };
});
