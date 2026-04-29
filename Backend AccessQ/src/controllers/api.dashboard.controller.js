const prisma = require("../prisma/client");

exports.getOverviewStats = async (req, res) => {
    try {
        // Ensure the user is authenticated and has an organization
        if (!req.user || !req.user.org_id) {
            return res.status(401).json({ success: false, message: "Non autorisé ou aucune organisation liée." });
        }

        const orgId = req.user.org_id;
        const now = new Date();

        // 1. Total Active QR Codes for the Organization
        const activeQrCount = await prisma.qrCode.count({
            where: {
                event: { org_id: orgId },
                status: "active",
                deleted_at: null
            }
        });

        // 2. Total Scans (Global for the org's QR codes)
        const totalScansInfo = await prisma.qrCode.aggregate({
            _sum: {
                scans_count: true
            },
            where: {
                event: { org_id: orgId }
            }
        });
        const totalScans = totalScansInfo._sum.scans_count || 0;

        // 3. Upcoming Events
        const upcomingEventsCount = await prisma.event.count({
            where: {
                org_id: orgId,
                EventSchedules: {
                    some: {
                        start_date: { gt: now }
                    }
                },
                deleted_at: null
            }
        });

        // Fetch the name of the very next event for the subtitle
        const nextEventSchedule = await prisma.eventSchedule.findFirst({
            where: {
                event: {
                    org_id: orgId,
                    deleted_at: null
                },
                start_date: { gt: now }
            },
            orderBy: {
                start_date: 'asc'
            },
            include: {
                event: {
                    select: { title: true }
                }
            }
        });
        const nextEvent = nextEventSchedule ? nextEventSchedule.event : null;

        // 4. Active Agents (ORG_AGENT or OPERATOR)
        const activeAgentsCount = await prisma.userQ.count({
            where: {
                org_id: orgId,
                role: { in: ['ORG_AGENT', 'OPERATOR'] },
                deleted_at: null
            }
        });

        // 6. Scans per Day (Last 7 Days)
        const scansByDay = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const count = await prisma.scanLog.count({
                where: {
                    qr_code: { event: { org_id: orgId } },
                    scanned_at: {
                        gte: date,
                        lt: nextDay
                    }
                }
            });

            scansByDay.push({
                name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                fullDate: date.toLocaleDateString('fr-FR'),
                scans: count
            });
        }

        // 7. Top Agents by scan count
        const topAgentsRaw = await prisma.scanLog.groupBy({
            by: ['scanned_by_id'],
            where: { qr_code: { event: { org_id: orgId } } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 3
        });

        const topAgents = await Promise.all(topAgentsRaw.map(async (item) => {
            const agent = await prisma.userQ.findUnique({
                where: { user_id: item.scanned_by_id },
                select: { full_name: true }
            });
            return {
                name: agent.full_name,
                count: item._count.id
            };
        }));

        // 5. Recent Scans (last 5) - we need to fetch them again as the previous block replaced it
        const recentScans = await prisma.scanLog.findMany({
            where: { qr_code: { event: { org_id: orgId } } },
            take: 5,
            orderBy: { scanned_at: 'desc' },
            include: {
                qr_code: { select: { unique_token: true, event: { select: { title: true } } } },
                scanned_by: { select: { full_name: true } }
            }
        });

        const formattedScans = recentScans.map(scan => ({
            id: scan.id,
            code: scan.qr_code.unique_token.substring(0, 8),
            event: scan.qr_code.event.title,
            agent: scan.scanned_by.full_name,
            time: scan.scanned_at,
            status: scan.status
        }));

        return res.status(200).json({
            success: true,
            data: {
                activeQrs: activeQrCount,
                totalScans: totalScans,
                upcomingEvents: upcomingEventsCount,
                nextEventTitle: nextEvent ? nextEvent.title : "Aucun événement",
                activeAgents: activeAgentsCount,
                recentScans: formattedScans,
                scansByDay: scansByDay,
                topAgents: topAgents
            }
        });



    } catch (error) {
        console.error("Erreur lors de la récupération des stats du Dashboard: ", error);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors du chargement des statistiques."
        });
    }
};
