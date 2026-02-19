import { requireAuth } from '../../utils/authGuard';
import { getXrplClient } from '../../utils/xrpl';

export default defineEventHandler(async (event) => {
    const { dbUser } = await requireAuth(event);

    if (!dbUser.walletAddress) {
        return { balances: [], xrpBalance: '0' };
    }

    const client = await getXrplClient();

    let xrpBalance = '0';
    let trustLines: any[] = [];

    try {
        // Récupérer le solde XRP
        const accountInfo = await client.request({
            command: 'account_info',
            account: dbUser.walletAddress,
        });
        // Convertir drops en XRP
        xrpBalance = (Number(accountInfo.result.account_data.Balance) / 1_000_000).toString();

        // Récupérer les trust lines (tokens fongibles)
        const lines = await client.request({
            command: 'account_lines',
            account: dbUser.walletAddress,
        });
        trustLines = lines.result.lines || [];
    } catch (e: any) {
        // Si le compte n'existe pas encore sur le ledger
        if (e.data?.error === 'actNotFound') {
            return { balances: [], xrpBalance: '0', needsFunding: true };
        }
    }

    const balances = trustLines.map((line: any) => ({
        currency: line.currency,
        balance: line.balance,
        limit: line.limit,
        issuer: line.account,
    }));

    return {
        walletAddress: dbUser.walletAddress,
        xrpBalance,
        balances,
    };
});
