const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
    const token = req.cookies.token;


    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication token required. Please sign in." });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token. Please sign in again." });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticationToken };