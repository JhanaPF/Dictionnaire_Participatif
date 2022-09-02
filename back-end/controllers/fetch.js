//          --------     Controlleurs    ----------
//  séparer la logique métier de nos routes en contrôleurs pour rendre le code plus lisible dans les routes et faciliter la maintenance

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {nissart} = require('../schemas.js'); // Importation des schémas pour envoyer des objets vers les collections de MongoDb


router.fetchOneWord =  (req, res) => {   
    // console.log("Requête d'un mot"); 
    
    const isValid = mongoose.Types.ObjectId.isValid(req.params._id); 
    if(!isValid) return res.status(400).json({});
  
    
    nissart.aggregate([
        {   $match: {_id: mongoose.Types.ObjectId(req.params._id)}  },
        {   
            $lookup:{
                from: 'NissartAdditionalData',
                localField: '_id',
                foreignField: 'word_id',
                as: 'additionalData'
            },
        },
        {   $unwind: '$additionalData'  }
    ])
    .then(word => res.status(200).json({message: word[0]}))
    .catch(error => res.status(400).json({ error }));

}; 

router.fetchOneDictionnary =  (req, res) => {    
  //  console.log("Requête dictionnaire");
    
    nissart.find()
    .then(dic => res.status(200).json({message: dic}))
    .catch(error => res.status(400).json({}));

}; 

module.exports = router;