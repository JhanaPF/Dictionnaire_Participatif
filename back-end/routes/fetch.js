/*
      Routes pour récupérer une des informations
*/

const express = require('express');
const router = express.Router();
const fetchCtrl = require('../controllers/fetch');
const auth = require('../middleware/auth');


router.get('/fetchNissartDictionnary', auth, fetchCtrl.fetchOneDictionnary);
router.get('/fetchOneWord/_id/:_id', auth, fetchCtrl.fetchOneWord); 

module.exports = router;