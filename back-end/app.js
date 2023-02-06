/*
      Application Express
*/

const express = require('express')
const app = express()
const saveRoutes = require('./routes/save')
const fetchRoutes = require('./routes/fetch')
const userRoutes = require('./routes/user')
//const cors = require('cors')
//app.use(cors())


// app.use est un middleware. Un middleware est un bloc de code qui traite les requêtes et réponses de votre application.
// Il est possible d'appeler autant de middleware que l'on souhaite avec l'ajout d'une fonction next() en argument

app.get('/', (req, res) => {
      console.log('requête entrante')
      // res.send('Test')
      next()
})

app.use((req, res, next) => { 
     // console.log("Entrée d'une requête", req.headers)      
      res.setHeader('Access-Control-Allow-Origin', '*') // Autorise CORS
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
      next()
}) 

app.use(express.json()) // Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :

app.use('/save', saveRoutes) // CRUD
app.use('/fetch', fetchRoutes) 
app.use('/auth', userRoutes) 

module.exports = app