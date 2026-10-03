const crypto = require('crypto');

// Protects the "read requests" endpoints so only the driver can list them.
module.exports = function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;
  const provided = req.get('x-admin-key') || '';
  if (!expected) {
    return res.status(503).json({ success: false, message: 'Admin access is not configured.' });
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  next();
};
