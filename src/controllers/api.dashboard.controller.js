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
                start_date: { gt: now },
                deleted_at: null
            }
        });

        // Fetch the name of the very next event for the subtitle
        const nextEvent = await prisma.event.findFirst({
            where: {
                org_id: orgId,
                start_date: { gt: now },
                deleted_at: null
            },
            orderBy: {
                start_date: 'asc'
            },
            select: { title: true }
        });

        // 4. Active Agents (ORG_AGENT or OPERATOR)
        const activeAgentsCount = await prisma.user.count({
            where: {
                org_id: orgId,
                role: { in: ['ORG_AGENT', 'OPERATOR'] },
                deleted_at: null
            }
        });

        // 5. Recent Scans (last 5)
        const recentScans = await prisma.scanLog.findMany({
            where: {
                qr_code: {
                    event: { org_id: orgId }
                }
            },
            take: 5,
            orderBy: {
                scanned_at: 'desc'
            },
            include: {
                qr_code: { select: { unique_token: true, event: { select: { title: true } } } },
                scanned_by: { select: { full_name: true } }
            }
        });

        // Format recent scans for easy frontend consumption
        const formattedScans = recentScans.map(scan => ({
            id: scan.id,
            code: scan.qr_code.unique_token.substring(0, 8), // Short preview
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
                recentScans: formattedScans
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
