import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';
import { getXrplClient, getAdminWallet } from '../../utils/xrpl';
import { Payment, TrustSet } from 'xrpl';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.currencyCode || !body.name || !body.totalSupply) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode, name et totalSupply requis' });
    }

    // Le currency code XRPL doit faire exactement 3 caractères OU être un hex de 40 caractères
    let currencyCode = body.currencyCode.toUpperCase();
    if (currencyCode.length !== 3 && currencyCode.length !== 40) {
        throw createError({ statusCode: 400, statusMessage: 'currencyCode doit faire 3 caractères (ex: TRT)' });
    }

    const client = await getXrplClient();
    const adminWallet = getAdminWallet();

    // Vérifier si le token existe déjà en base
    const existing = await prisma.fungibleToken.findUnique({
        where: { currencyCode },
    });

    if (existing) {
        throw createError({ statusCode: 409, statusMessage: 'Ce code de devise existe déjà' });
    }

    // Enregistrer le token en base de données
    const token = await prisma.fungibleToken.create({
        data: {
            currencyCode,
            name: body.name,
            totalSupply: body.totalSupply,
            issuerAddress: adminWallet.address,
            description: body.description || null,
        },
    });

    return {
        success: true,
        token,
        issuerAddress: adminWallet.address,
        message: `Token ${currencyCode} créé. Les utilisateurs doivent établir une trust line avant de recevoir des tokens.`,
    };
});
