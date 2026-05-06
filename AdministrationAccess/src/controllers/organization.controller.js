const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listOrganizations = async (req, res) => {
    try {
        const organizations = await prisma.organization.findMany({
            include: {
                _count: {
                    select: { usersQ: true, events: true }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.render('organizations/list', {
            user: req.user,
            organizations,
            error: null,
            success: req.query.success || null
        });
    } catch (error) {
        console.error("Erreur listOrganizations:", error);
        res.render('organizations/list', {
            user: req.user,
            organizations: [],
            error: "Erreur lors du chargement des organisations.",
            success: null
        });
    }
};

exports.deactivateOrganization = async (req, res) => {
    const orgId = parseInt(req.params.id);
    try {
        // Update organization is_active to false
        await prisma.organization.update({
            where: { org_id: orgId },
            data: { is_active: false }
        });

        // Also deactivate all users belonging to this organization
        await prisma.userQ.updateMany({
            where: { org_id: orgId },
            data: { is_active: false }
        });

        res.redirect('/organizations?success=Organisation et utilisateurs désactivés avec succès.');
    } catch (error) {
        console.error("Erreur deactivateOrganization:", error);
        res.redirect('/organizations?error=Erreur lors de la désactivation.');
    }
};

exports.archiveOrganization = async (req, res) => {
    const orgId = parseInt(req.params.id);
    try {
        // Soft delete the organization by setting deleted_at
        await prisma.organization.update({
            where: { org_id: orgId },
            data: { deleted_at: new Date() }
        });

        // Also soft delete the users of this organization
        await prisma.userQ.updateMany({
            where: { org_id: orgId },
            data: { deleted_at: new Date() }
        });

        res.redirect('/organizations?success=Organisation et utilisateurs archivés avec succès.');
    } catch (error) {
        console.error("Erreur archiveOrganization:", error);
        res.redirect('/organizations?error=Erreur lors de l\'archivage.');
    }
};

exports.activateOrganization = async (req, res) => {
    const orgId = parseInt(req.params.id);
    try {
        // Update organization is_active to true
        await prisma.organization.update({
            where: { org_id: orgId },
            data: { is_active: true }
        });

        // Also activate all users belonging to this organization
        await prisma.userQ.updateMany({
            where: { org_id: orgId },
            data: { is_active: true }
        });

        res.redirect('/organizations?success=Organisation et utilisateurs réactivés avec succès.');
    } catch (error) {
        console.error("Erreur activateOrganization:", error);
        res.redirect('/organizations?error=Erreur lors de la réactivation.');
    }
};
