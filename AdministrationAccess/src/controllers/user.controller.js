const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listUsers = async (req, res) => {
    try {
        const users = await prisma.userQ.findMany({
            include: {
                organization: {
                    select: { name: true }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.render('users/list', {
            user: req.user,
            users,
            error: null,
            success: req.query.success || null
        });
    } catch (error) {
        console.error("Erreur listUsers:", error);
        res.render('users/list', {
            user: req.user,
            users: [],
            error: "Erreur lors du chargement des utilisateurs.",
            success: null
        });
    }
};

exports.deactivateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        await prisma.userQ.update({
            where: { user_id: userId },
            data: { is_active: false }
        });
        res.redirect('/users?success=Utilisateur désactivé avec succès.');
    } catch (error) {
        console.error("Erreur deactivateUser:", error);
        res.redirect('/users?error=Erreur lors de la désactivation.');
    }
};

exports.activateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        await prisma.userQ.update({
            where: { user_id: userId },
            data: { is_active: true }
        });
        res.redirect('/users?success=Utilisateur réactivé avec succès.');
    } catch (error) {
        console.error("Erreur activateUser:", error);
        res.redirect('/users?error=Erreur lors de la réactivation.');
    }
};
