const prisma = require("../prisma/client");

exports.findByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email: email }
  });
};

exports.createOrgAndAdminUser = async (orgData, userData) => {
  // Use a transaction since we are creating both an organization and its admin user
  return await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: orgData
    });

    const user = await tx.user.create({
      data: {
        ...userData,
        org_id: org.id
      }
    });

    return { org, user };
  });
};
