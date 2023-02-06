//          --------     Controlleur    ----------

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { wordValidation, wordAdditionalDataValidation } = require('../validators/validators.js')
const {nissart, nissartAdditionalData} = require('../schemas.js') // Importation des schémas pour envoyer des objets vers les collections de MongoDb

const isValid = (word, additionalData) => {

    const validateWord = wordValidation.validate(word)
    const validateAdditionalData = wordAdditionalDataValidation.validate(additionalData)
    
    if(!validateWord.error && !validateAdditionalData.error) {
        return true
    }

    if(validateWord.error || validateAdditionalData.error) { 
        console.log(validateWord.error && validateWord.error, validateAdditionalData.error && validateAdditionalData.error) 
        return false 
    }

}

router.saveWord = (req, res) => {
    console.log("Ajout d'un nouveau mot", req.body)
    
    if(!isValid(req.body.word, req.body.additionalData)) return res.status(500).json({})

    const newWord = new nissart({
        ...req.body.word
    })

    let newAdditionalData = new nissartAdditionalData({
        ...req.body.additionalData,
    })

    newWord.save() 
    .then((result) => {
        console.log(result)
        newAdditionalData.word_id = result._id
        newAdditionalData.save()
    })
    .then(() => {
        console.log('Nouveau mot ' + req.body.word.word + ' enregistré')
        res.status(201).json({})
    })
    .catch(error => {
        res.status(400).json({})
        console.log(error)
    })
}

router.updateWord = (req, res) => {
    
    const idValid = mongoose.Types.ObjectId.isValid(req.body.word_id) 
    if(!idValid) return res.status(400).json({})
    if(!isValid(req.body.word, req.body.additionalData)) return res.status(500).json({})
    
    console.log("Updating word", req.body.word_id)  
    nissart.updateOne({_id: req.body.word_id}, req.body.word) 
    .then(() => nissartAdditionalData.updateOne({word_id: req.body.word_id}, req.body.additionalData))
    .then((result) => {
        console.log('Le mot ' + req.body.word + ' a été mis à jour')
        res.status(201)
    })
    .catch(error => {
        res.status(400)
        console.log(error)
    })

}

router.deleteWord = (req, res) => {
    
    const word_id = req.body.word_id
    console.log("Deleting word " + word_id)
    const isValid = mongoose.Types.ObjectId.isValid(word_id)
    if(!isValid) return res.status(400).json({})

    nissart.deleteOne({_id: word_id}) 
    .then(  nissartAdditionalData.deleteOne({_id: word_id})  )
    .then((result) => {
        const successMsg = "Word " + word_id + "deleted"
        res.status(201).json({})
    })
    .catch(error => {
        const errorMsg = "Failed to delete" + word_id
        console.log(errorMsg)
        res.status(400).json({errorMsg})
    })
}

module.exports = router