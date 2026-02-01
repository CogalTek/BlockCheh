import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';

export default defineEventHandler(async (event) => {
    const sessionManager = getKindeSessionManager(event);
    const logoutUrl = await kindeClient.logout(sessionManager);
    // Nettoyer la session locale après avoir récupéré l'URL
    await sessionManager.destroySession();
    return sendRedirect(event, logoutUrl.toString());
});
