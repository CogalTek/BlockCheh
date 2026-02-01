import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';

export default defineEventHandler(async (event) => {
    const user = await kindeClient.getUser(getKindeSessionManager(event));
});
