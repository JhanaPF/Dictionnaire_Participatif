/*
    ***     Serveur     ***
*/

const http = require('http'); 
const app = require('./app');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') }); // dotenv

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // Supprime sécurité !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, // Etablit une connexion avec la bdd Mongo
{   useNewUrlParser: true,  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(err => console.log('Echec connexion à la base de donnée', err));


const normalizePort = val => { // Renvoie un port valide
    const port = parseInt(val, 10);
   
    if (isNaN(port))  return val;
    else if (port >= 0) return port;
    else return false;
};

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port); // Initialise l'application Express sur un port


const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
       case 'EACCES':
         console.error(bind + ' requires elevated privileges.');
         process.exit(1);
       case 'EADDRINUSE':
         console.error(bind + ' is already in use.');
         process.exit(1);
       default:
         throw error;
    }
};

const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
server.listen(port); // Vérifie si l'environnement sur lequel tourne notre serveur utilise un port sinon on utilisera par défaut le port 3000
// -> Ecoute des requêtes à partir d'un port