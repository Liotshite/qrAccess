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
