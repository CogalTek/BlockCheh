import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';

export default defineEventHandler(async (event) => {
    try {
        const isAuthenticated = await kindeClient.isAuthenticated(getKindeSessionManager(event));

        if (!isAuthenticated) {
            return { authenticated: false, user: null };
        }

        const user = await kindeClient.getUser(getKindeSessionManager(event));

        return {
            authenticated: true,
            user
        };
    } catch (error) {
        return { authenticated: false, user: null };
    }
});
