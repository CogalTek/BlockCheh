import { prisma } from '../../utils/prisma';

export default defineEventHandler(async () => {
    const tokens = await prisma.fungibleToken.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return { tokens };
});
