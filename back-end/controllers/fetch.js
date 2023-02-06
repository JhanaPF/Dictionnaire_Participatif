//          --------     Controlleurs    ----------

const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {nissart} = require('../schemas.js') 


router.fetchOneWord =  (req, res) => {   
    
    const isValid = mongoose.Types.ObjectId.isValid(req.params._id) 
    if(!isValid) return res.status(400).json({})
  
    
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
    .catch(error => res.status(400).json({ error }))

} 

router.fetchOneDictionnary =  (req, res) => {    

    nissart.find()
    .then(dic => res.status(200).json({message: dic}))
    .catch(error => res.status(400).json({error}))
} 

module.exports = router