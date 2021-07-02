const Joi = require('joi');

const Validation = {
    eventPost: Joi.object({
        employer: Joi.string().required(),
        // type: Joi.string().required(),
        // source: Joi.string().required(),
        // dateTime: Joi.string().required(),
        // datetimeReal: Joi.string().required(),
        // identificator: Joi.string().required(),
        // deviceCode: Joi.string(),
        // location: Joi.string(),
        // locationGps: Joi.string(),
        // gps: Joi.string(),
        // comment: Joi.string()
    })
}

module.exports.eventValidation = async (cb, array) => {
    const t = await Validation.eventPost.validateAsync(array)

    cb(t);
}