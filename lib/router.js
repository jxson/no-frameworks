
var routes = require('routes')
  , router = new routes.Router()

router.addRoute('/', require('./routes/index'))
router.addRoute('/health', require('./routes/health'))
router.addRoute('/bundle*', require('./routes/bundle'))
router.addRoute('/recipes/:uuid?', require('./routes/recipes'))

module.exports = router
