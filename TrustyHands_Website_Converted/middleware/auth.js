const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user_id) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Please log in to access this resource'
    });
};

const attachUserData = (req, res, next) => {
    if (req.session && req.session.user_id) {
        req.user = {
            id: req.session.user_id,
            firstName: req.session.firstName,
            email: req.session.email
        };
    }
    next();
};

module.exports = { isAuthenticated, attachUserData };
