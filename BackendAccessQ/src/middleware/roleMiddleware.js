const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Accès refusé. Vous n'avez pas les permissions nécessaires." 
            });
        }
        next();
    };
};

module.exports = requireRole;
