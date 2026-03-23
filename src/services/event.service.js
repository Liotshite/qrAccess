const prisma = require("../prisma/client");

// Find by the name (Filtered by Org)
exports.findByTitle = async (orgId, titleSearch) => {
  return await prisma.event.findMany({
    where: {
      org_id: orgId,
      OR: [
        { title: { contains: titleSearch, mode: 'insensitive' } },
        { location: { contains: titleSearch, mode: 'insensitive' } },
        { description: { contains: titleSearch, mode: 'insensitive' } }
      ],
      deleted_at: null
    },
    include: {
      _count: {
        select: { qr_codes: { where: { status: 'active', deleted_at: null } } }
      }
    },
    orderBy: { start_date: 'asc' }
  });
};

// Find by id (Filtered by Org)
exports.findById = async (orgId, eventId) => {
  return await prisma.event.findFirst({
    where: { event_id: eventId, org_id: orgId, deleted_at: null },
    include: {
      _count: {
        select: { qr_codes: { where: { status: 'active', deleted_at: null } } }
      }
    }
  });
};

// Find all events (Filtered by Org)
exports.findAll = async (orgId) => {
  return await prisma.event.findMany({
    where: {
      org_id: orgId,
      deleted_at: null
    },
    include: {
      _count: {
        select: { qr_codes: { where: { status: 'active', deleted_at: null } } }
      }
    },
    orderBy: { start_date: 'asc' }
  });
};

// Create event (Bound to Org)
exports.createEvent = async (data) => {
  return await prisma.event.create({ data });
};

// Update event (Assumes ownership verified by controller)
exports.updateEvent = async (eventId, data) => {
  return prisma.event.update({
    where: { event_id: eventId },
    data
  });
};

// Delete event (Soft delete)
exports.deleteEvent = async (eventId) => {
  return prisma.event.update({
    where: { event_id: eventId },
    data: {
      deleted_at: new Date()
    }
  });
};

