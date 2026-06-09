const router = require('express').Router();
const auth = require('../middleware/auth');
const isAdmin = (req, res, next) => {
  const user = DB.findOne('users', u => u._id === req.userId);
  if (user && (user.role === 'admin' || user.role === 'superadmin')) next();
  else res.status(403).json({ msg: 'Access denied' });
};
router.get('/stats', auth, isAdmin, (req, res) => {
  res.json({
    users: DB.find('users').length,
    servers: DB.find('hosting').length,
    active: DB.find('hosting', h => h.status === 'active').length
  });
});
router.get('/users', auth, isAdmin, (req, res) => res.json(DB.find('users').map(u => ({ ...u, password: undefined }))));
router.post('/ban/:id', auth, isAdmin, (req, res) => { DB.update('users', req.params.id, { status: 'banned' }); res.json({ msg: 'Banned' }); });
router.post('/unban/:id', auth, isAdmin, (req, res) => { DB.update('users', req.params.id, { status: 'active' }); res.json({ msg: 'Unbanned' }); });
module.exports = router;