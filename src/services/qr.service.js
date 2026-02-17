const prisma = require("../prisma/client");

exports.getAllQrs = async () => {
    return await prisma.qr.findMany();
};

exports.getQrById = async (id) => {
    return await prisma.qr.findUnique({
        where: { id: id },
    });
};

exports.createQr = async (data) => {
    return await prisma.qr.create({
        data,
    });
};

exports.updateQr = async (id, data) => {
    return await prisma.qr.update({
        where: { id: id },
        data,
    });
};

exports.deleteQr = async (id) => {
    return await prisma.qr.delete({
        where: { id: id },
    });
};

