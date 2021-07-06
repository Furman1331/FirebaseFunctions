const Joi = require('joi');

const Validation = {
    eventPost: Joi.object().keys({
        // TODO: Check if valid strings is good.
        typeId: Joi.string().required().valid('work start', 'break start', 'break finish', 'temp out start', 'temp out finish', 'work finish', 'comment'),
        // TODO: Check if valid strings is good.
        sourceId: Joi.string().required().valid('reader', 'www', 'email', 'sms', 'reader - smarthphone', 'application - smartphone', 'panel'),
        // TODO: change format to dateTime.
        datetime: Joi.date().required(),
        // // datetimeReal: Joi.string().required(),
        identificator: Joi.string().required(),
        // deviceCode: Joi.string(),
        // location: Joi.string(),
        // locationGps: Joi.string(),
        // gps: Joi.string(),
        // comment: Joi.string()
    })
}

module.exports.eventValidation = async (cb, array) => {
    try {
        console.log(array);
        if(typeof array.datetime.seconds == 'number') {
            array.datetime = new Date((array.datetime.seconds * 1000) + 7200000); // Change format from timeStamp to dateTime.
            const validateData = await Validation.eventPost.validateAsync(array);

            cb(validateData);
        } else {
            console.log(`dateTime is valid.`)
        }
    } catch(e) {
        if(e instanceof Joi.ValidationError) {
            if(typeof e.details[0] !== "undefined" && typeof e.details[0].context !== "undefined") {
                console.log(`[Error][Validate] ${e.details[0].context.key} is valid, check if data included is correct!`);
            }
        }
    }
}