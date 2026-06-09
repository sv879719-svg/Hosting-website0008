const router = require('express').Router();
const auth = require('../middleware/auth');
router.get('/me', auth, (req, res) => {
  const user = DB.findOne('users', u => u._id === req.userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  const { password, ...rest } = user;
  res.json(rest);
});
module.exports = router;