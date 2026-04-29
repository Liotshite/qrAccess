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
  const { start_date, end_date, id_area, areaIds, ...eventData } = data;

  const idsToCreate = areaIds && Array.isArray(areaIds) ? areaIds : (id_area ? [Number(id_area)] : [1]);

  return await prisma.event.create({
    data: {
      ...eventData,
      EventSchedules: {
        create: idsToCreate.map(id => ({
          start_date: start_date,
          end_date: end_date,
          id_area: Number(id)
        }))
      }
    },
    include: { EventSchedules: true }
  });
};

// Update event (Assumes ownership verified by controller)
exports.updateEvent = async (eventId, data) => {
  const { start_date, end_date, id_area, areaIds, ...eventData } = data;

  const updateData = { ...eventData };

  if (start_date || end_date || id_area || areaIds) {
    // If no explicit areaIds but we have id_area, use it
    const finalAreaIds = areaIds && Array.isArray(areaIds) 
        ? areaIds.map(Number) 
        : (id_area ? [Number(id_area)] : null);

    if (finalAreaIds) {
      // Simplest way to sync: delete all and recreate
      await prisma.eventSchedule.deleteMany({
        where: { id_event: eventId }
      });

      await prisma.eventSchedule.createMany({
        data: finalAreaIds.map(id => ({
          id_event: eventId,
          id_area: id,
          start_date: start_date ? new Date(start_date) : new Date(),
          end_date: end_date ? new Date(end_date) : new Date()
        }))
      });
    } else if (start_date || end_date) {
        // Just update dates for all existing schedules if areas didn't change
        await prisma.eventSchedule.updateMany({
            where: { id_event: eventId },
            data: {
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined
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

