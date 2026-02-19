import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const currencyCode = (query.currencyCode as string || '').toUpperCase();

    if (!currencyCode) {
        // Retourner tous les tokens disponibles
        const tokens = await prisma.fungibleToken.findMany();
        return { tokens };
    }

    try {
        const client = await getXrplClient();
        const adminWallet = getAdminWallet();

        const ammInfo = await client.request({
            command: 'amm_info',
            asset: {
                currency: currencyCode,
                issuer: adminWallet.address,
            },
            asset2: { currency: 'XRP' },
        });

        const amm = ammInfo.result.amm;

        return {
            exists: true,
            currencyCode,
            pool: {
                tokenBalance: amm.amount,
                xrpBalance: amm.amount2,
                lpToken: amm.lp_token,
                tradingFee: amm.trading_fee,
                auctionSlot: amm.auction_slot,
            },
        };
    } catch (e: any) {
        return {
            exists: false,
            currencyCode,
            message: 'Aucun pool AMM trouvé pour ce token',
        };
    }
});
