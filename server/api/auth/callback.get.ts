import { kindeClient } from '../../utils/kinde';
import { getKindeSessionManager } from '../../utils/session';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    try {
        const url = getRequestURL(event);

        // Utiliser la même instance de sessionManager tout au long du processus
        const sessionManager = getKindeSessionManager(event);
        await kindeClient.handleRedirectToApp(sessionManager, url);

        // Extraire les infos depuis l'id_token directement (les cookies ne sont pas encore disponibles dans cette requête)
        const idToken = await sessionManager.getSessionItem('id_token');
        if (idToken && typeof idToken === 'string') {
            // Décoder le JWT sans vérification (Kinde l'a déjà vérifié)
            const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

            if (payload.email && payload.sub) {
                // Create or update user
                await prisma.user.upsert({
                    where: { email: payload.email },
                    update: {
                        name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
                        idKinde: payload.sub,
                    },
                    create: {
                        email: payload.email,
                        idKinde: payload.sub,
                        name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
                        userMeta: {
                            create: {
                                language: 'fr' // default language
                            }
                        }
                    }
                });
            }
        }

        return sendRedirect(event, process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL! || '/');
    } catch (error) {
        console.error('[Callback] Error during authentication:', error);
        throw createError({
            statusCode: 500,
            message: 'Authentication failed',
            cause: error
        });
    }
});
