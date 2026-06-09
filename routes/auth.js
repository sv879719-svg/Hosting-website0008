const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (DB.findOne('users', u => u.email === email)) return res.status(400).json({ msg: 'Email exists' });
  const hashed = await bcrypt.hash(password, 12);
  const user = DB.insert('users', { username, email, password: hashed, balance: 0, plan: 'free', role: 'user', status: 'active' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret');
  res.json({ token, user: { id: user._id, username, email, balance: 0 } });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = DB.findOne('users', u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ msg: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret');
  res.json({ token, user: { id: user._id, username: user.username, email, balance: user.balance, role: user.role } });
});
module.exports = router;