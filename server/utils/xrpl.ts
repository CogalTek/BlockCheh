import { Client, Wallet } from 'xrpl';

let xrplClient: Client | null = null;

/**
 * Retourne un client XRPL connecté (singleton).
 * Se reconnecte automatiquement si déconnecté.
 */
export const getXrplClient = async (): Promise<Client> => {
    const network = process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233';

    if (!xrplClient) {
        xrplClient = new Client(network);
    }

    if (!xrplClient.isConnected()) {
        await xrplClient.connect();
    }

    return xrplClient;
};

/**
 * Retourne le wallet admin (issuer) depuis la seed configurée.
 */
export const getAdminWallet = (): Wallet => {
    const seed = process.env.XRPL_ADMIN_SEED;
    if (!seed || seed === 'sEdxxxxxxxxxxxxxxxxxxxxxxxxx') {
        throw new Error('XRPL_ADMIN_SEED non configurée dans .env');
    }
    return Wallet.fromSeed(seed);
};

/**
 * Déconnecte proprement le client XRPL.
 */
export const disconnectXrpl = async (): Promise<void> => {
    if (xrplClient?.isConnected()) {
        await xrplClient.disconnect();
    }
    xrplClient = null;
};
