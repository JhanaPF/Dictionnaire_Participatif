// Midlleware à placer en intermédiaires dans les routes pour sécuriser leurs accès

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const userId = decodedToken.userId;
        req.decodedToken = decodedToken; // nécessaire au middleware isAdmin

        if(req.body.userId && req.body.userId !== userId) {throw 'Id non valable'}
        else  { console.log("Authentifié"); next();}
    }
    catch (error) {
        console.log("Requête non authentifiée", error);
        res.status(401).json({error: "Requête non authentifiée"});
    }
}