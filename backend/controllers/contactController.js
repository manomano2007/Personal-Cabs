const ContactMessage = require('../models/ContactMessage');
const { validateContact } = require('../utils/validate');

exports.createMessage = async (req, res, next) => {
  try {
    const { errors, data, isValid } = validateContact(req.body);
    if (!isValid) {
      return res.status(422).json({ success: false, message: 'Please correct the highlighted fields.', errors });
    }
    await ContactMessage.create(data);
    res.status(201).json({ success: true, message: 'Message received. Aravinth will get back to you shortly.' });
  } catch (err) {
    next(err);
  }
};

exports.listMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
};
