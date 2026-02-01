import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';
import { randomUUID } from 'node:crypto';

export default defineEventHandler(async (event) => {
    const state = randomUUID();
    const loginUrl = await kindeClient.login(getKindeSessionManager(event), {
        authUrlParams: {
            state
        }
    });
    return sendRedirect(event, loginUrl.toString());
});
