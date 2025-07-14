const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { summary,getBooksAlert } = require('../../controllers/admin/inventoryControllers')

router.get('/summary', authenticateToken, summary)
router.get('/books-alert',authenticateToken,getBooksAlert)

module.exports=router