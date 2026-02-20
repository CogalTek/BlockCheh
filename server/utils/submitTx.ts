import { Client, Wallet } from 'xrpl';

const MAX_RETRIES = 3;
const LEDGER_OFFSET = 75; // Marge large pour éviter l'expiration (défaut xrpl.js = ~20)

/**
 * Soumet une transaction XRPL avec une marge de LastLedgerSequence plus large
 * et retry automatique en cas d'expiration.
 *
 * Résout le problème :
 * "The latest ledger sequence X is greater than the transaction's LastLedgerSequence (Y)"
 */
export const submitTransaction = async (
    client: Client,
    tx: Record<string, any>,
    wallet: Wallet,
    retries: number = MAX_RETRIES,
): Promise<any> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const currentLedger = await client.getLedgerIndex();

            const prepared = await client.autofill({
                ...tx,
                LastLedgerSequence: currentLedger + LEDGER_OFFSET,
            } as any);

            const signed = wallet.sign(prepared);
            const result = await client.submitAndWait(signed.tx_blob);
            return result;
        } catch (error: any) {
            const isLedgerExpired = error?.message?.includes('LastLedgerSequence');

            if (isLedgerExpired && attempt < retries) {
                console.warn(
                    `[XRPL] Transaction expirée (tentative ${attempt}/${retries}), retry...`,
                );
                continue;
            }

            throw error;
        }
    }
};
