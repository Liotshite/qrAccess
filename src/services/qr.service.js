const prisma = require("../prisma/client");

// Get all QR Codes belonging to events owned by the user's organization
exports.getAllQrsForOrg = async (orgId) => {
    return await prisma.qrCode.findMany({
        where: {
            event: {
                org_id: orgId
            },
            deleted_at: null
        },
        include: {
            event: {
                select: { title: true }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });
};

// Find a specific QR Code
exports.getQrById = async (id) => {
    return await prisma.qrCode.findUnique({
        where: { id: id },
    });
};

// Create a new QR Code record
exports.createQr = async (data) => {
    return await prisma.qrCode.create({
        data,
    });
};

// Update an existing QR Code
exports.updateQr = async (id, data) => {
    return await prisma.qrCode.update({
        where: { id: id },
        data,
    });
};

// Soft Delete a QR Code
exports.deleteQr = async (id) => {
    return await prisma.qrCode.update({
        where: { id: id },
        data: { deleted_at: new Date() }
    });
};
