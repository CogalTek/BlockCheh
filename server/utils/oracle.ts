import { prisma } from './prisma';
import { getXrplClient, getAdminWallet } from './xrpl';

/**
 * Oracle: récupère et stocke les prix des actifs.
 * Combine les données CoinGecko (XRP/EUR) avec les ratios AMM on-chain.
 */
export const fetchOraclePrices = async () => {
    try {
        // 1. Prix XRP/EUR depuis CoinGecko
        let xrpEur = 0;
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=eur');
            const data = await response.json();
            xrpEur = data.ripple?.eur || 0;
        } catch {
            console.warn('[Oracle] Impossible de récupérer le prix XRP depuis CoinGecko');
        }

        // Sauvegarder le prix XRP
        if (xrpEur > 0) {
            await prisma.oraclePrice.create({
                data: {
                    asset: 'XRP',
                    priceXrp: '1',
                    priceEur: xrpEur.toString(),
                    source: 'coingecko',
                },
            });
        }

        // 2. Prix des tokens depuis les pools AMM
        const tokens = await prisma.fungibleToken.findMany();

        for (const token of tokens) {
            try {
                const client = await getXrplClient();
                let adminWallet;
                try {
                    adminWallet = getAdminWallet();
                } catch {
                    continue;
                }

                const ammInfo = await client.request({
                    command: 'amm_info',
                    asset: {
                        currency: token.currencyCode,
                        issuer: adminWallet.address,
                    },
                    asset2: { currency: 'XRP' },
                });

                const amm = ammInfo.result.amm;
                let tokenPriceXrp = '0';

                // Calculer le prix du token en XRP depuis le ratio du pool
                if (amm.amount && amm.amount2) {
                    const tokenAmount = typeof amm.amount === 'object'
                        ? parseFloat((amm.amount as any).value || '0')
                        : 0;
                    const xrpAmount = typeof amm.amount2 === 'string'
                        ? Number(amm.amount2) / 1_000_000
                        : typeof amm.amount2 === 'object'
                            ? parseFloat((amm.amount2 as any).value || '0')
                            : 0;

                    if (tokenAmount > 0) {
                        tokenPriceXrp = (xrpAmount / tokenAmount).toFixed(6);
                    }
                }

                const tokenPriceEur = (parseFloat(tokenPriceXrp) * xrpEur).toFixed(4);

                await prisma.oraclePrice.create({
                    data: {
                        asset: token.currencyCode,
                        priceXrp: tokenPriceXrp,
                        priceEur: tokenPriceEur,
                        source: 'amm_pool',
                    },
                });
            } catch {
                // Pool AMM n'existe pas encore pour ce token
            }
        }

        console.log('[Oracle] Prix mis à jour');
    } catch (error) {
        console.error('[Oracle] Erreur:', error);
    }
};
