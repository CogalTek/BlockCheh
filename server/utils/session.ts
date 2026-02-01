import type { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import type { H3Event } from "h3";

export const getKindeSessionManager = (event: H3Event): SessionManager => {
	const tempStorage: Record<string, unknown> = {};

	return {
		async getSessionItem(key: string) {
			// D'abord vérifier le stockage temporaire (pour la même requête)
			if (tempStorage[key] !== undefined) {
				return tempStorage[key];
			}
			// Sinon récupérer depuis les cookies
			return getCookie(event, key);
		},
		async setSessionItem(key: string, value: unknown) {
			const cookieOptions = {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: "lax" as const,
				maxAge: 60 * 60 * 24 * 7, // 7 jours
			};
			// Stocker dans le cache temporaire pour accès immédiat
			tempStorage[key] = value;

			if (typeof value === "string") {
				setCookie(event, key, value, cookieOptions);
			} else {
				setCookie(event, key, JSON.stringify(value), cookieOptions);
			}
		},
		async removeSessionItem(key: string) {
			delete tempStorage[key];
			deleteCookie(event, key);
		},
		async destroySession() {
			// Supprimer tous les cookies Kinde
			const cookiesToDelete = [
				'access_token',
				'id_token',
				'kinde',
				'refresh_token',
				'post-login-redirect-url'
			];

			for (const cookie of cookiesToDelete) {
				delete tempStorage[cookie];
				deleteCookie(event, cookie);
			}
		},
	};
};
