const supabase = require('../supabase');
const { verifyToken, getSecret } = require('../utils/auth');

// Requires "Authorization: Bearer <token>" from a signed-in customer.
module.exports = async function requireUser(req, res, next) {
  try {
    if (!getSecret()) {
      return res.status(503).json({
        success: false,
        message: 'Sign-in is not configured on the server.',
      });
    }

    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : '';

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to continue.',
      });
    }

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, mobile')
      .eq('id', payload.sub)
      .maybeSingle();

    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to continue.',
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
    };

    next();
  } catch (err) {
    next(err);
  }
};