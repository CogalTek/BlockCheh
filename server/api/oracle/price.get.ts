import { prisma } from '../../utils/prisma';
import { fetchOraclePrices } from '../../utils/oracle';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const asset = query.asset as string | undefined;
    const refresh = query.refresh === 'true';

    // Rafraîchir les prix si demandé
    if (refresh) {
        await fetchOraclePrices();
    }

    // Récupérer les derniers prix
    if (asset) {
        const latestPrice = await prisma.oraclePrice.findFirst({
            where: { asset: asset.toUpperCase() },
            orderBy: { timestamp: 'desc' },
        });

        if (!latestPrice) {
            // Si pas de prix en base, essayer de fetch
            await fetchOraclePrices();
            const newPrice = await prisma.oraclePrice.findFirst({
                where: { asset: asset.toUpperCase() },
                orderBy: { timestamp: 'desc' },
            });

            return { price: newPrice || null };
        }

        return { price: latestPrice };
    }

    // Récupérer le dernier prix de chaque asset
    const assets = await prisma.oraclePrice.findMany({
        distinct: ['asset'],
        orderBy: { timestamp: 'desc' },
    });

    return { prices: assets };
});
