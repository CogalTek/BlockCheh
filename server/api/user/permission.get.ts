import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    let user;
    try {
        user = await kindeClient.getUser(getKindeSessionManager(event));
    } catch {
        return { permission: null };
    }

    if (!user) {
        return { permission: null };
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            idKinde: user.id,
        },
    })

    return { permission: dbUser?.role || "USER" };
});
