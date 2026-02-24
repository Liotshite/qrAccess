const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

// Une API ne s'occupe plus d'afficher des pages EJS, c'est l'application React Native qui le fait !

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.findByName(email);

        if (!user) {
            // On renvoie un code d'erreur HTTP 404 (Not Found) ou 401 (Unauthorized)
            // avec un message au format JSON.
            return res.status(401).json({
                success: false,
                message: "Cette email n'est pas enregistré"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Mot de passe incorrect"
            });
        }

        // Le token est généré comme avant
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "100d" } // Souvent plus long sur mobile
        );

        // CHANGEMENT MAJEUR : 
        // Au lieu de mettre le token dans un cookie ("res.cookie...")
        // et de rediriger ("res.redirect..."), on renvoie le token et les infos
        // de l'utilisateur directement en JSON.
        // L'application React Native lira cette réponse et sauvegardera le token.
        return res.status(200).json({
            success: true,
            message: "Connexion réussie",
            token: token,
            user: {
                id: user.id,
                name: user.name, // Ajustez selon votre schéma
                email: user.email
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
        const { name, password } = req.body;
        var user = await userService.findByName(name);

        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            user = { name: name, password: hashed };

            const newUser = await userService.createUser(user);

            return res.status(201).json({
                success: true,
                message: "Inscription réussie",
                user: { id: newUser.id, name: newUser.name }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Une erreur s'est produite."
        });
    }
};


exports.viewprofile = async (req, res) => {
    try {
        // On suppose que le middleware d'authentification a extrait l'utilisateur du Token JWT
        // et l'a placé dans req.user
        const user = req.user;

        // Au lieu de res.render('user/profile', { user })
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
    // Dans une API REST avec JWT (sans session côté serveur),
    // la déconnexion consiste principalement à dire à l'application
    // cliente (React Native) d'effacer le token qu'elle a stocké en mémoire.
    // Le serveur n'a presque rien à faire.
    return res.status(200).json({
        success: true,
        message: "Déconnexion réussie. Veuillez supprimer le token côté client."
    });
};
