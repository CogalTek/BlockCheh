/**
 * Script pour configurer le compte issuer (admin) sur XRPL.
 * Active les flags RequireAuth et DefaultRipple.
 *
 * Usage : npx tsx scripts/setup-issuer.ts
 */
import { setupIssuerCompliance } from '../server/utils/xrplSetup'
import 'dotenv/config'

const seed = process.env.XRPL_ADMIN_SEED

if (!seed) {
    console.error('❌ XRPL_ADMIN_SEED non défini dans .env')
    process.exit(1)
}

console.log('🔧 Configuration du compte issuer sur XRPL...')

setupIssuerCompliance(seed)
    .then((result) => {
        console.log('✅ RequireAuth :', result.requireAuth.result.meta)
        console.log('✅ DefaultRipple :', result.defaultRipple.result.meta)
        console.log('🎉 Compte issuer configuré avec succès !')
    })
    .catch((err) => {
        console.error('❌ Erreur :', err.message)
        process.exit(1)
    })
