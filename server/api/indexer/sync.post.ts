import { requireAdmin } from '../../utils/authGuard';
import { runIndexer } from '../../utils/indexer';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);

    await runIndexer();

    return {
        success: true,
        message: 'Synchronisation terminée',
        timestamp: new Date().toISOString(),
    };
});
