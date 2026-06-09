const router = require('express').Router();
router.get('/plans', (req, res) => res.json(DB.find('plans')));
module.exports = router;