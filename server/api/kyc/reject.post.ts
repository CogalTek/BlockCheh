import { requireAdmin } from '../../utils/authGuard';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    await requireAdmin(event);
    const body = await readBody(event);

    if (!body.kycRequestId) {
        throw createError({ statusCode: 400, statusMessage: 'kycRequestId requis' });
    }

    const kycRequest = await prisma.kycRequest.findUnique({
        where: { id: body.kycRequestId },
    });

    if (!kycRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Demande KYC non trouvée' });
    }

    if (kycRequest.status !== 'PENDING') {
        throw createError({ statusCode: 400, statusMessage: 'Cette demande a déjà été traitée' });
    }

    await prisma.kycRequest.update({
        where: { id: kycRequest.id },
        data: { status: 'REJECTED' },
    });

    return {
        success: true,
        message: 'KYC rejeté',
    };
});
