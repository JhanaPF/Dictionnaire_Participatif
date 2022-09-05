//          --------     Controlleur    ----------
//  séparer la logique métier de nos routes en contrôleurs pour rendre le code plus lisible dans les routes et faciliter la maintenance

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { wordValidation, wordAdditionalDataValidation } = require('../validators/validators.js');
const {nissart, nissartAdditionalData} = require('../schemas.js'); // Importation des schémas pour envoyer des objets vers les collections de MongoDb

const isValid = (word, additionalData) => {

    const validateWord = wordValidation.validate(word);
    const validateAdditionalData = wordAdditionalDataValidation.validate(additionalData);
    
    if(!validateWord.error && !validateAdditionalData.error) {
        console.log("Le schéma du nouveau mot est validé");
        return true;
    }

    if(validateWord.error || validateAdditionalData.error) { 
        console.log(validateWord.error && validateWord.error, validateAdditionalData.error && validateAdditionalData.error); 
        return false; 
    }

}

router.saveWord = (req, res) => {
    //console.log("Ajout d'un nouveau mot", req.body)
    if(!isValid(req.body.word, req.body.additionalData)) return res.status(500).json({});

    const newWord = new nissart({
        ...req.body.word
    });

    let newAdditionalData = new nissartAdditionalData({
        ...req.body.additionalData,
    })

    newWord.save() 
        .then((result) => {
            console.log(result);
            newAdditionalData.word_id = result._id;
            newAdditionalData.save();
        })
        .then(() => {
            console.log('Nouveau mot ' + req.body.word.word + ' enregistré');
            res.status(201).json({});
        })
        .catch(error => {
            res.status(400).json({});
            console.log(error)
        });
};

router.updateWord = (req, res) => {
    console.log("Mise à jour d'un mot", req.body);  
    
    const idValid = mongoose.Types.ObjectId.isValid(req.body.word_id); 
    if(!idValid) return res.status(400).json({});
    if(!isValid(req.body.word, req.body.additionalData)) return res.status(500).json({});

  
    nissart.updateOne({_id: req.body.word_id}, req.body.word) 
    .then(() => nissartAdditionalData.updateOne({word_id: req.body.word_id}, req.body.additionalData))
    .then((result) => {
        console.log('Le mot ' + req.body.word + ' a été mis à jour');
        res.status(201).json({});
    })
    .catch(error => {
        res.status(400).json({});
        console.log(error);
    });

};

router.deleteWord = (req, res) => {
    //console.log("Suppression d'un mot");

    const word_id = req.body.word_id;  // req.body = req.data dans la requête Axios
    const isValid = mongoose.Types.ObjectId.isValid(word_id);
    if(!isValid) return res.status(400).json({});

    nissart.deleteOne({_id: word_id}) 
    .then(  nissartAdditionalData.deleteOne({_id: word_id})  )
    .then((result) => {
        console.log("Le mot avec l'id : " + word_id + " a été supprimé");
        res.status(201).json({});
    })
    .catch(error => {
        console.log("Echec de suppression du mot avec l'id : " + word_id);
        res.status(400).json({});
    });
};

module.exports = router;