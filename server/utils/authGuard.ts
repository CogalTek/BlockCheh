import type { H3Event } from 'h3';
import { kindeClient } from './kinde';
import { getKindeSessionManager } from './session';
import { prisma } from './prisma';

/**
 * Vérifie que l'utilisateur est authentifié et retourne son profil DB.
 * Lance une erreur 401 si non authentifié.
 */
export const requireAuth = async (event: H3Event) => {
    const kindeUser = await kindeClient.getUser(getKindeSessionManager(event));

    if (!kindeUser) {
        throw createError({ statusCode: 401, statusMessage: 'Non authentifié' });
    }

    const dbUser = await prisma.user.findUnique({
        where: { idKinde: kindeUser.id },
        include: { kycRequest: true },
    });

    if (!dbUser) {
        throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé en base' });
    }

    return { kindeUser, dbUser };
};

/**
 * Vérifie que l'utilisateur est admin (ADMIN ou SUPERADMIN).
 */
export const requireAdmin = async (event: H3Event) => {
    const { kindeUser, dbUser } = await requireAuth(event);

    if (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Accès refusé : admin requis' });
    }

    return { kindeUser, dbUser };
};

/**
 * Vérifie que l'utilisateur est whitelisté et non blacklisté.
 */
export const requireWhitelisted = async (event: H3Event) => {
    const { kindeUser, dbUser } = await requireAuth(event);

    if (dbUser.isBlacklisted) {
        throw createError({ statusCode: 403, statusMessage: 'Votre compte est blacklisté' });
    }

    if (!dbUser.isWhitelisted) {
        throw createError({ statusCode: 403, statusMessage: 'KYC requis – votre compte n\'est pas encore whitelisté' });
    }

    return { kindeUser, dbUser };
};
