const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const hostingManager = require('../services/hostingManager');
const upload = multer({ dest: 'uploads/' });

router.post('/create', auth, async (req, res) => {
  try {
    const user = DB.findOne('users', u => u._id === req.userId);
    const plan = DB.findOne('plans', p => p._id === (user.plan || 'free'));
    const hosting = await hostingManager.createHosting(req.userId, req.body.name, req.body.type, plan.limits);
    res.json(hosting);
  } catch(e) { res.status(400).json({ msg: e.message }); }
});
router.post('/upload/:id', auth, upload.single('file'), async (req, res) => {
  try { await hostingManager.deployProject(req.params.id, req.file.path); res.json({ msg: 'Deployed' }); }
  catch(e) { res.status(400).json({ msg: e.message }); }
});
router.post('/start/:id', auth, async (req, res) => {
  try { await hostingManager.startServer(req.params.id); res.json({ msg: 'Started' }); }
  catch(e) { res.status(400).json({ msg: e.message }); }
});
router.post('/stop/:id', auth, async (req, res) => {
  try { await hostingManager.stopServer(req.params.id); res.json({ msg: 'Stopped' }); }
  catch(e) { res.status(400).json({ msg: e.message }); }
});
router.post('/restart/:id', auth, async (req, res) => {
  try { await hostingManager.restartServer(req.params.id); res.json({ msg: 'Restarted' }); }
  catch(e) { res.status(400).json({ msg: e.message }); }
});
router.get('/list', auth, (req, res) => res.json(DB.find('hosting', h => h.user === req.userId)));
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    await hostingManager.stopServer(req.params.id);
    DB.remove('hosting', req.params.id);
    res.json({ msg: 'Deleted' });
  } catch(e) { res.status(400).json({ msg: e.message }); }
});
module.exports = router;