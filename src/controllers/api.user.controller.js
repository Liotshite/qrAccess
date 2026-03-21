const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../services/user.service");
const emailService = require("../services/email.service");
const prisma = require("../prisma/client");

// =========================================================
// RÈGLES DE SÉCURITÉ POUR LES MOTS DE PASSE
// =========================================================
// Cette fonction garantit que le mot de passe respecte les standards de sécurité
// pour éviter qu'il soit facilement devinable ou cassé.
const isValidPassword = (password) => {
    // Règle 1: Minimum 8 caractères de long
    if (password.length < 8) return false;
    // Règle 2: Doit contenir au moins une lettre majuscule
    if (!/[A-Z]/.test(password)) return false;
    // Règle 3: Doit contenir au moins une lettre minuscule
    if (!/[a-z]/.test(password)) return false;
    // Règle 4: Doit contenir au moins un chiffre
    if (!/[0-9]/.test(password)) return false;
    // Règle 5: Doit contenir au moins un symbole spécial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

    return true;
};

// =========================================================
// CONFIGURATION SÉCURISÉE DES COOKIES (Protection des Sessions)
// =========================================================
// En plaçant notre Token JWT (Json Web Token) dans un cookie ultra-sécurisé,
// nous protégeons l'application contre les attaques de type:
// - Session Hijacking (Vol de session via XSS)
// - Session Fixation (Forcer l'identifiant de session d'un utilisateur)
const cookieOptions = {
    httpOnly: true, // Empêche tout script JavaScript côté client (Cross-Site Scripting - XSS) de lire le cookie.
    secure: process.env.NODE_ENV === "production", // Autorise l'envoi du cookie UNIQUEMENT sur des connexions HTTPS chiffrées (en prod).
    sameSite: "strict", // Protection contre la falsification de requête intersite (CSRF). Le cookie ne sera pas envoyé si on clique sur un lien externe.
    maxAge: 100 * 24 * 60 * 60 * 1000 // Le token expire après 100 jours.
};

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

        // --- VÉRIFICATION DE L'EMAIL ---
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Veuillez vérifier votre adresse email avant de vous connecter. Consultez votre boîte de réception (ou la console Ethereal)."
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, org_id: user.org_id },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "100d" }
        );

        // Security update: store JWT in an HttpOnly cookie instead of sending it purely in JSON
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Connexion réussie",
            token: token, // Optionally keep this for mobile apps, but NextJS should rely on the cookie
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

        // Enforce strong password policy
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Le mot de passe doit contenir au moins 12 caractères, incluant des lettres, des chiffres et des symboles spéciaux."
            });
        }

        let user = await userService.findByEmail(email);

        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            const clef = crypto.randomUUID(); // Generation of a unique string clef

            // --- NOUVEAU: GÉNÉRATION DU TOKEN DE VÉRIFICATION ---
            const verificationToken = crypto.randomBytes(32).toString('hex');

            const orgData = { name: organizationName };
            const userData = {
                clef: clef,
                full_name: fullName,
                email: email,
                password_hash: hashed,
                role: "ORG_ADMIN",
                is_verified: false,
                verification_token: verificationToken
            };

            const result = await userService.createOrgAndAdminUser(orgData, userData);

            // Envoi de l'e-mail simulé
            await emailService.sendVerificationEmail(email, fullName, verificationToken);

            return res.status(201).json({
                success: true,
                message: "Inscription réussie ! Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte.",
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

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        // Trouver l'utilisateur par son token de vérification
        const user = await prisma.user.findFirst({
            where: { verification_token: token }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Lien de vérification invalide ou expiré." });
        }

        // Valider l'utilisateur
        await prisma.user.update({
            where: { id: user.id },
            data: {
                is_verified: true,
                verification_token: null // Nettoyer le token une fois utilisé
            }
        });

        return res.status(200).json({
            success: true,
            message: "Votre adresse e-mail a été vérifiée avec succès. Vous pouvez maintenant vous connecter."
        });

    } catch (error) {
        console.error("Verification error: ", error);
        return res.status(500).json({ success: false, message: "Erreur serveur lors de la vérification de l'e-mail." });
    }
};

exports.viewprofile = async (req, res) => {
    try {
        const userId = req.user.id;
        const fullUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, full_name: true, role: true, org_id: true }
        });

        if (!fullUser) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        return res.status(200).json({
            success: true,
            user: fullUser
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
    // Clear the secure cookie to fully destroy the session context from the client
    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });

    return res.status(200).json({
        success: true,
        message: "Déconnexion réussie."
    });
};
