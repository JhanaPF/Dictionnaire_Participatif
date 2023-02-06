const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') //mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema.

const wordSchema = mongoose.Schema({
    word : {type: String, required: true, unique: true}, 
    class : {type: Number}, // Classe du mot : nom, verbe, adjectif, etc
    definition : {type: String}, // Défini dans le même idiome    
    // Les champs suivant correspondent à la traduction dans la langue pivot
    translated_definition : {type: String}, // Définition en français (langue pivot)
    level: {type: String}, // Niveau de langage => 0: parlé de tous les jours dans le français, 1: connu des niçois, 2: familier, 3: soutenu
    categories: [Number], // Champ lexical
    source: {type: Number}, // Si le mot a été ajouté    
    phonetic: {type: String},
    checked: {type: Boolean, default: false}, // Approuvé par un admin (si des mots ont été ajoutés automatiquement avec de potentielles erreurs par exemple) depuis un dictionnaire externe
})

const additionalDataSchema = mongoose.Schema({
    word_id: {type: mongoose.Schema.ObjectId, unique: true},
    sentence: {type: String}, // Phrase en contexte
    sentence_vocal: {type: String}, // Url du chemin de stockage

    riddle: {type: String}, // Devinette pour mot-croisé en niçois
    translated_riddle: {type: String}, // Devinette en français
    story: {type: String}, // Anecdotes historiques, littéraires, etc...
    vocal: {type: String}, // Url du fichier vocal du mot stocké sur le serveur

    //updates: [
    //    {
    //        user_id: {type: mongoose.Schema.ObjectId}, 
    //        date: {type: Date}
    //    }
    //] // Modifications apportées par les utilisateurs (date + id)
})

// Schema for both players and dahsbiard's users
const userSchema = mongoose.Schema({
    name : {type: String},
    mail : {type: String, required: true, unique: true},
    password : {type: String},
    role:{type: String, enum: ['guest, admin, superAdmin']}, // SuperAdmin, Admin, Joueur, etc...
    //dialects: {type: Array}, // Langue dans lesquelles le joueur a joué
    // partiesPlayed: {type: Array} // Une clef pour chaque dialecte, un tableau par catégorie contenant le nombre de parties classées par difficultées
})


userSchema.plugin(uniqueValidator)
wordSchema.plugin(uniqueValidator)

const languages = ["nissart"] // Définir la liste de dialectes 
let models = {}
for (const language of languages) { // Générer dynamiquement les schémas Mongo (Idiome + Mots de l'idiome en contexte dans une phrase)
    let collectionName = language.charAt(0).toUpperCase() + language.slice(1)
    models[language] = mongoose.model(language, wordSchema, language) // 3ème paramètre pour définir le nom de la collection
    
    const languageSentences = language + "AdditionalData"
    collectionName = languageSentences.charAt(0).toUpperCase() + languageSentences.slice(1) 
    models[languageSentences] = mongoose.model(languageSentences, additionalDataSchema, languageSentences.charAt(0).toUpperCase() + languageSentences.slice(1))
}

const user = mongoose.model('User', userSchema) 

module.exports = {...models, user}