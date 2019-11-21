/**
 * Root Config Controller
 */

import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
  return res.send('Config')
})

module.exports = router
