const Joi = require('joi');

const wordValidation = Joi.object({
    word: Joi.string()
        .max(100)
        .required(),
    class: Joi.number().optional().allow(null),
    definition: Joi.string().optional().allow(null),
    translated_definition: Joi.string().optional().allow(null),
    level: Joi.string().optional().allow(null),
    categories: Joi.array().items(Joi.number().integer()).optional().allow(null),
    source: Joi.number().optional().allow(null),
    phonetic: Joi.string().optional().allow(null),
    checked: Joi.boolean().optional().allow(null),
})

const wordAdditionalDataValidation = Joi.object({
    sentence: Joi.string().optional().allow(null),
    sentence_vocal: Joi.string().optional().allow(null),
    riddle: Joi.string().optional().allow(null),
    translated_riddle: Joi.string().optional().allow(null),
    story: Joi.string().optional().allow(null),
    vocal: Joi.string().optional().allow(null),
})

const userValidation = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
        .required(),

    repeat_password: Joi.ref('password'),

    mail: Joi.string()
        .email({ minDomainSegments: 1 })
        .required()
})

module.exports = {userValidation, wordValidation, wordAdditionalDataValidation};