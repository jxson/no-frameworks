
var routes = require('routes')
  , router = new routes.Router()

router.addRoute('/', require('./routes/index'))
router.addRoute('/health', require('./routes/health'))

module.exports = router
