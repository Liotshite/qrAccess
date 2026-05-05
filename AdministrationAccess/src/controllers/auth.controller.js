const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Note: I should install bcrypt

exports.renderLogin = (req, res) => {
    // If already logged in, redirect to dashboard
    const token = req.cookies.adminToken;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/dashboard');
        } catch (e) {
            // Invalid token, proceed to login
        }
    }
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email and ensure they are SUPER_ADMIN
        const user = await prisma.userQ.findUnique({
            where: { email }
        });

        if (!user || user.role !== 'SUPER_ADMIN') {
            return res.render('login', { error: 'Identifiants invalides ou accès refusé.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.render('login', { error: 'Identifiants invalides ou accès refusé.' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.user_id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'Une erreur est survenue lors de la connexion.' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/login');
};

exports.requireAuth = (req, res, next) => {
    const token = req.cookies.adminToken;
    
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        if (req.user.role !== 'SUPER_ADMIN') {
            return res.redirect('/login');
        }
        
        next();
    } catch (error) {
        return res.redirect('/login');
    }
};

exports.renderDashboard = async (req, res) => {
    try {
        // Fetch some basic stats for the dashboard
        const totalUsers = await prisma.userQ.count();
        const totalOrganizations = await prisma.organization.count();
        const totalEvents = await prisma.event.count();

        res.render('dashboard', {
            user: req.user,
            stats: {
                totalUsers,
                totalOrganizations,
                totalEvents
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('dashboard', {
            user: req.user,
            stats: { totalUsers: 0, totalOrganizations: 0, totalEvents: 0 },
            error: 'Erreur lors du chargement des statistiques.'
        });
    }
};
