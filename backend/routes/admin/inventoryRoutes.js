const express = require('express')
const router = express.Router()
const { authenticationToken} = require('../../middleware/useAuth')
const { summary,getBooksAlert } = require('../../controllers/admin/inventoryControllers')

router.get('/summary',  authenticationToken, summary)
router.get('/books-alert', authenticationToken,getBooksAlert)

module.exports=router