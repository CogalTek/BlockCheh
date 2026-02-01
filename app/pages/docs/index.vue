<template>
    <div style="padding: 1%;">
        <h1>API Swagger</h1>
        <docsItem v-for="item in rt" :item="item" :id="item.name"/>
    </div>
</template>

<script setup>

    const rt = [
        {
            name: "Login",
            description: "Initie le processus de connexion via Kinde avec un état aléatoire",
            path: "/api/auth/login",
            method: "GET",
            parameters: [],
            responses: [
                { status: 302, description: "Redirection vers Kinde pour l'authentification" }
            ]
        },
        {
            name: "Callback",
            description: "Gère le callback après authentification Kinde. Crée ou met à jour l'utilisateur en base de données (upsert) avec email, nom, idKinde et métadonnées (langue par défaut: fr)",
            path: "/api/auth/callback",
            method: "GET",
            parameters: [],
            responses: [
                { status: 302, description: "Redirection vers la page post-login (NUXT_KINDE_POST_LOGIN_REDIRECT_URL ou /)" },
                { status: 500, description: "Erreur d'authentification" }
            ]
        },
        {
            name: "Logout",
            description: "Déconnecte l'utilisateur, détruit la session locale et redirige vers l'URL de déconnexion Kinde",
            path: "/api/auth/logout",
            method: "GET",
            parameters: [],
            responses: [
                { status: 302, description: "Redirection vers l'URL de déconnexion Kinde" }
            ]
        },
        {
            name: "Me",
            description: "Vérifie l'authentification et retourne les informations de l'utilisateur Kinde actuellement connecté",
            path: "/api/auth/me",
            method: "GET",
            parameters: [],
            responses: [
                { status: 200, description: "État d'authentification et données utilisateur", schema: "{ authenticated: boolean, user: KindeUser | null }" }
            ]
        },
        {
            name: "Store",
            description: "Récupère l'utilisateur Kinde (endpoint sans retour - en développement)",
            path: "/api/auth/store",
            method: "GET",
            parameters: [],
            responses: [
                { status: 200, description: "Pas de retour défini" }
            ]
        },
        {
            name: "Get User",
            description: "Récupère l'utilisateur Kinde actuel et son profil en base de données via l'idKinde",
            path: "/api/user",
            method: "GET",
            parameters: [],
            responses: [
                { status: 200, description: "Utilisateur Kinde et profil BDD", schema: "{ user: KindeUser, dbUser: User | null }" },
                { status: 401, description: "Non authentifié via Kinde" }
            ]
        },
        {
            name: "Get User Permission",
            description: "Récupère le rôle/permission de l'utilisateur depuis la base de données (par défaut: USER)",
            path: "/api/user/permission",
            method: "GET",
            parameters: [],
            responses: [
                { status: 200, description: "Permission utilisateur", schema: "{ permission: string }" },
                { status: 401, description: "Non authentifié via Kinde" }
            ]
        }
    ]

</script>