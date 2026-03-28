const prisma = require("../prisma/client");

exports.getQrByToken = async (token) => {
    return await prisma.qrCode.findUnique({
        where: { unique_token: token },
        include: {
            event: {
                include: { organization: true }
            }
        }
    });
};

exports.recordScan = async (qrId, scannerId, status) => {
    // 1. Create ScanLog
    await prisma.scanLog.create({
        data: {
            qr_code_id: qrId,
            scanned_by_id: scannerId,
            status: status
        }
    });

    // 2. If authorized, increment scans_count
    if (status === "authorized") {
        await prisma.qrCode.update({
            where: { qr_id: qrId },
            data: {
                scans_count: { increment: 1 }
            }
        });
    }
};

exports.updateQrStatus = async (qrId, newStatus) => {
    return await prisma.qrCode.update({
        where: { qr_id: qrId },
        data: { status: newStatus }
    });
};
