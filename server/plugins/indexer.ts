import { runIndexer } from '../utils/indexer';

let indexerInterval: ReturnType<typeof setInterval> | null = null;

export default defineNitroPlugin((nitroApp) => {
    // Lancer l'indexer toutes les 60 secondes
    indexerInterval = setInterval(async () => {
        try {
            await runIndexer();
        } catch (error) {
            console.error('[Indexer Plugin] Erreur:', error);
        }
    }, 60_000); // 60 secondes

    // Première exécution après 10 secondes (laisser le serveur démarrer)
    setTimeout(async () => {
        try {
            await runIndexer();
        } catch (error) {
            console.error('[Indexer Plugin] Erreur au démarrage:', error);
        }
    }, 10_000);

    // Cleanup quand le serveur s'arrête
    nitroApp.hooks.hook('close', () => {
        if (indexerInterval) {
            clearInterval(indexerInterval);
            indexerInterval = null;
        }
    });
});
