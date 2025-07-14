const jwt = require('jsonwebtoken')

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  // If no token is found, return a 401 Unauthorized error
  if (token == null) {
    return res.status(401).json({ message: "Authentication token required" })
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    // If token verification fails, log the error and return a 403 Forbidden error
    if (err) {
      console.error("Token verification error:", err)  // Log the error
      return res.status(403).json({ message: "Token expired, Please sign in" })
    }

    // If token is valid, attach the user information to the request object
    req.user = user
    // Call the next middleware function in the stack
    next()
  })
}

module.exports = { authenticateToken }
