const supabase = require('../supabase');

const { hashPassword, verifyPassword, signToken } = require('../utils/auth');

const clean = (v) =>
  typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';

const normalizeMobile = (v) =>
  String(v || '')
    .replace(/\D/g, '')
    .replace(/^91(?=\d{10}$)/, '');

const isMobile = (v) => /^[6-9]\d{9}$/.test(v);

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  mobile: u.mobile,
});

exports.signUp = async (req, res, next) => {
  try {
    const name = clean(req.body.name);
    const mobile = normalizeMobile(req.body.mobile);
    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    const errors = {};

    if (name.length < 2 || name.length > 80) {
      errors.name = 'Please enter your full name.';
    }

    if (!isMobile(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (password.length < 6 || password.length > 100) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errors).length) {
      return res.status(422).json({
        success: false,
        message: 'Please correct the highlighted fields.',
        errors,
      });
    }

    // Check whether mobile number already exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('mobile', mobile)
      .maybeSingle();

    if (findError) {
      return next(findError);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'An account with this mobile number already exists. Please sign in.',
        errors: {
          mobile: 'This number is already registered.',
        },
      });
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user in Supabase
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        name,
        mobile,
        password_hash: passwordHash,
      })
      .select('id, name, mobile')
      .single();

    if (insertError) {
      // Duplicate mobile number
      if (insertError.code === '23505') {
        return res.status(409).json({
          success: false,
          message:
            'An account with this mobile number already exists. Please sign in.',
          errors: {
            mobile: 'This number is already registered.',
          },
        });
      }

      return next(insertError);
    }

    res.status(201).json({
      success: true,
      token: signToken(user.id),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const mobile = normalizeMobile(req.body.mobile);
    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    const errors = {};

    if (!isMobile(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    }

    if (Object.keys(errors).length) {
      return res.status(422).json({
        success: false,
        message: 'Please correct the highlighted fields.',
        errors,
      });
    }

    // Find user in Supabase
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, name, mobile, password_hash')
      .eq('mobile', mobile)
      .maybeSingle();

    if (findError) {
      return next(findError);
    }

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        success: false,
        message: 'Mobile number or password is incorrect.',
      });
    }

    res.json({
      success: true,
      token: signToken(user.id),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      mobile: req.user.mobile,
    },
  });
};