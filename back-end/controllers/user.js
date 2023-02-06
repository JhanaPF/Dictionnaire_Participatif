//          --------     Controlleur    ----------

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator =  require('validator')
const { userValidation } = require('../validators/validators.js')
require('dotenv').config()

// Importation des schémas pour envoyer des objets vers les collections de MongoDb
const {user} = require('../schemas.js')

router.signup = (req, res) => {
    console.log("Sign up", req.body)
    
    const validation = userValidation.validate(req.body)
    if(validation.error) { 
        console.log(validation.error) 
        return res.status(500).json({}) 
    }


    bcrypt.hash(req.body.password, 12)
    .then(hash => {
        
        const newUser = new user({
            name: req.body.name,
            mail: req.body.mail,
            password: hash
        })
        
        newUser.save()
        .then(() => res.status(201).json({ message: 'New user registered' }))
        .catch(error => res.status(400).json({ error }))
        
    })
    .catch(error => res.status(500).json({ error }))
    
}

router.signin = (req, res) => {
    console.log("Login", req.body)
    
    if(!validator.isEmail(req.body.mail)){
        console.log("Connexion attempt with invalid mail")
        return res.status(400).json({})
    }

    user.findOne({ mail: req.body.mail })
    .then(userFound => {
        if (!userFound) {
            console.log("Utilisateur non trouvé")
            return res.status(401).json({}) 
        }
        
        bcrypt.compare(req.body.password, userFound.password)
        .then(valid => {
            //console.log(valid)
            if (!valid) {
                return res.status(401).json({ error: 'Wrong password', sendPassword:req.body.password, passwordFound: userFound.password})
            }

            res.status(200).json({
                userId: userFound._id,
                token: jwt.sign(
                    {userId: userFound._id, isAdmin: userFound.role === "admin"},
                    process.env.SECRET, //  RANDOM_TOKEN_SECRET Ou process.env.SECRET
                    {expiresIn: "24h"}
                )
            })
        })
        .catch(error => {
            return res.status(500).json({ error : 'Impossible de comparer les hashs'})}
        )

    })
    .catch(error =>  {
        console.log(error)
        return res.status(500).json({ error : 'Utilisateur inexistant'}) })
    
}

module.exports = router