const prisma = require("../prisma/client");

exports.findByEmail = (email) => {
  return prisma.userQ.findFirst({
    where: { email: email }
  });
};

exports.createOrgAndAdminUser = async (orgData, userData) => {
  // Use a transaction since we are creating both an organization and its admin user
  return await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: orgData
    });

    const user = await tx.userQ.create({
      data: {
        ...userData,
        org_id: org.org_id
      }
    });

    return { org, user };
  });
};
exports.updateUser = async (userId, data) => {
    return await prisma.userQ.update({
        where: { user_id: userId },
        data: data
    });
};

exports.updateOrganization = async (orgId, data) => {
    return await prisma.organization.update({
        where: { org_id: orgId },
        data: data
    });
};

exports.getOrganizationById = async (orgId) => {
    return await prisma.organization.findUnique({
        where: { org_id: orgId }
    });
};
