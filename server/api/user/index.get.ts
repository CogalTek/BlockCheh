import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';
import { prisma } from '../../utils/prisma';
import { createError, defineEventHandler, readBody } from 'h3';


export default defineEventHandler(async (event) => {
    const user = await kindeClient.getUser(getKindeSessionManager(event));

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non authentifié via Kinde',
        })
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            idKinde: user.id,
        },
    });

    return { user, dbUser };
});
