/*
      Route pour sauvegarder, modifier et supprimer 
*/

const express = require('express')
const router = express.Router()
const saveCtrl = require('../controllers/save')
const isAdmin = require('../middleware/isAdmin')
const auth = require('../middleware/auth')

router.post('/word', auth, isAdmin, saveCtrl.saveWord)
router.post('/updateWord', auth, isAdmin, saveCtrl.updateWord)
router.delete('/deleteWord', auth, isAdmin, saveCtrl.deleteWord)

module.exports = router