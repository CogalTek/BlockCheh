import { createKindeServerClient, GrantType } from "@kinde-oss/kinde-typescript-sdk";

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: process.env.NUXT_KINDE_AUTH_DOMAIN!,
    clientId: process.env.NUXT_KINDE_CLIENT_ID!,
    clientSecret: process.env.NUXT_KINDE_CLIENT_SECRET!,
    redirectURL: process.env.NUXT_KINDE_REDIRECT_URL!,
    logoutRedirectURL: process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL!,
});