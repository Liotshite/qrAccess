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
      EventSchedules: {
        include: { area: true },
        orderBy: { start_date: 'asc' }
      },
      _count: {
        select: { qr_codes: { where: { status: 'active', deleted_at: null } } }
      }
    },
    orderBy: { created_at: 'desc' }
  });
};

// Find by id (Filtered by Org)
exports.findById = async (orgId, eventId) => {
  return await prisma.event.findFirst({
    where: { event_id: eventId, org_id: orgId, deleted_at: null },
    include: {
      EventSchedules: {
        include: { area: true },
        orderBy: { start_date: 'asc' }
      },
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
      EventSchedules: {
        include: { area: true },
        orderBy: { start_date: 'asc' }
      },
      _count: {
        select: { qr_codes: { where: { status: 'active', deleted_at: null } } }
      }
    },
    orderBy: { created_at: 'desc' }
  });
};

// Create event (Bound to Org)
exports.createEvent = async (data) => {
  const { start_date, end_date, id_area, ...eventData } = data;

  return await prisma.event.create({
    data: {
      ...eventData,
      EventSchedules: {
        create: {
          start_date: start_date,
          end_date: end_date,
          id_area: id_area || 1 // Fallback to 1 if not provided
        }
      }
    },
    include: { EventSchedules: true }
  });
};

// Update event (Assumes ownership verified by controller)
exports.updateEvent = async (eventId, data) => {
  const { start_date, end_date, id_area, ...eventData } = data;

  const updateData = { ...eventData };

  if (start_date || end_date || id_area) {
    const firstSchedule = await prisma.eventSchedule.findFirst({
      where: { id_event: eventId },
      orderBy: { start_date: 'asc' }
    });

    if (firstSchedule) {
      await prisma.eventSchedule.update({
        where: { id: firstSchedule.id },
        data: {
          start_date: start_date || undefined,
          end_date: end_date || undefined,
          id_area: id_area ? Number(id_area) : undefined
        }
      });
    }
  }

  return prisma.event.update({
    where: { event_id: eventId },
    data: updateData,
    include: { EventSchedules: true }
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

