function adminAccessMiddleware(req, res, next) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;

  // If not configured, keep backward compatibility in local dev.
  if (!configuredCode) {
    return next();
  }

  const providedCode = req.headers["x-admin-access-code"];
  if (!providedCode || providedCode !== configuredCode) {
    return res.status(403).json({ message: "Admin access denied" });
  }

  return next();
}

module.exports = adminAccessMiddleware;
