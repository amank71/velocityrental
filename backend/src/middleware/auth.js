const { verifyToken } = require("../utils/sessions");

function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  const session = verifyToken(token);

  if (!session) {
    response.status(401).json({ message: "Login required." });
    return;
  }

  request.user = session;
  next();
}

function requireRole(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      response.status(403).json({ message: "You do not have access." });
      return;
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };
