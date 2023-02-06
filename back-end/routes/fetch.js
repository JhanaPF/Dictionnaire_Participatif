/*
      Routes pour récupérer une des informations
*/

const express = require('express')
const router = express.Router()
const fetchCtrl = require('../controllers/fetch')
const auth = require('../middleware/auth')


router.get('/nissartDictionnary', fetchCtrl.fetchOneDictionnary)
router.get('/oneWord/_id/:_id', fetchCtrl.fetchOneWord) 

module.exports = router