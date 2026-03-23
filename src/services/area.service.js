const prisma = require("../prisma/client");

exports.findAll = async (orgId) => {
    return await prisma.area.findMany({
        where: { org_id: orgId }
    });
};

exports.findById = async (orgId, areaId) => {
    return await prisma.area.findFirst({
        where: { area_id: areaId, org_id: orgId }
    });
};

exports.createArea = async (data) => {
    return await prisma.area.create({ data });
};

exports.updateArea = async (areaId, data) => {
    return await prisma.area.update({
        where: { area_id: areaId },
        data
    });
};

exports.deleteArea = async (areaId) => {
    return await prisma.area.delete({
        where: { area_id: areaId }
    });
};
