// Midlleware à placer en intermédiaires dans les routes pour sécuriser leurs accès

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        //console.log(req.headers.authorization)
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const tokenUserId = decodedToken.userId;
        req.decodedToken = decodedToken; // Nécessaire au middleware isAdmin

        if(req.body.userId && req.body.userId === tokenUserId) { next();} // Si l'id de l'utilisateur est le même que celui encodé dans le token
        else {throw 'Id non valable'}
    }
    catch (error) {
        console.log("Requête non authentifiée", error);
        res.status(401).json({error: "Requête non authentifiée"});
    }
}