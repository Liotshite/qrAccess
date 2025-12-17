const prisma = require("../prisma/client");

exports.findByName = (name) => {
  return prisma.user.findUnique({
    where: { name }
  });
};

exports.createUser = (data) => {
  return prisma.user.create({ data });
};
