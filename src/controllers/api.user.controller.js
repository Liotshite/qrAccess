const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../services/user.service");


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userService.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email or password incorrect"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Email or password incorrect"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, org_id: user.org_id },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "100d" }
        );

        return res.status(200).json({
            success: true,
            message: "Connexion réussie",
            token: token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la connexion."
        });
    }
};

exports.signin = async (req, res) => {
    try {
        const { fullName, email, organizationName, password } = req.body;

        if (!fullName || !email || !organizationName || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        let user = await userService.findByEmail(email);
        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            const clef = crypto.randomUUID(); // Generation of a unique string clef

            const orgData = { name: organizationName };
            const userData = {
                clef: clef,
                full_name: fullName,
                email: email,
                password_hash: hashed,
                role: "ORG_ADMIN"
            };

            const result = await userService.createOrgAndAdminUser(orgData, userData);

            // Give them a token directly on signin so they don't have to re-login immediately
            const token = jwt.sign(
                { id: result.user.id, email: result.user.email, role: result.user.role, org_id: result.org.id },
                process.env.JWT_SECRET || "fallback_secret",
                { expiresIn: "100d" }
            );

            return res.status(201).json({
                success: true,
                message: "Inscription réussie",
                token: token,
                user: { id: result.user.id, name: result.user.full_name, email: result.user.email, role: result.user.role, orgId: result.org.id }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Cet email est déjà pris"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Une erreur s'est produite lors de l'inscription."
        });
    }
};

exports.viewprofile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            success: true,
            user: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Erreur lors du chargement du profil."
        });
    }
};

exports.logout = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Déconnexion réussie. Veuillez supprimer le token côté client."
    });
};
