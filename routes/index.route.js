const router = require('express').Router()
const indexController =  require('../controllers/index.controller')

router.get('/', indexController.index)
router.post('/export', indexController.export)

module.exports = router