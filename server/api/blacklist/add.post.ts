import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.userId) {
        throw createError({ statusCode: 400, statusMessage: 'userId requis' });
    }

    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé' });
    }

    if (user.isBlacklisted) {
        throw createError({ statusCode: 400, statusMessage: 'Utilisateur déjà blacklisté' });
    }

    await prisma.user.update({
        where: { id: body.userId },
        data: {
            isBlacklisted: true,
            isWhitelisted: false,
        },
    });

    return {
        success: true,
        message: `Utilisateur ${user.email} blacklisté`,
    };
});
