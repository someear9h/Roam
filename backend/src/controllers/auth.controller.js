const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { registerSchema, loginSchema, updatePreferencesSchema } = require('../utils/validation');

exports.register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { name, email, phone, password, language, accessibility_needs } = result.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ success: false, error: 'User with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, phone, language, accessibility_needs, password: hashedPassword },
  });

  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    data: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
};

exports.login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
  success: false, 
  error: result.error.issues[0].message
});
  }
  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, data: { token } });
};

exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { name: true, email: true, phone: true, language: true, accessibility_needs: true },
  });
  res.json({ success: true, data: user });
};

exports.updatePreferences = async (req, res) => {
  const result = updatePreferencesSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { language, accessibility_needs } = result.data;

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { language, accessibility_needs },
  });
  res.json({ success: true, message: 'Preferences updated' });
};