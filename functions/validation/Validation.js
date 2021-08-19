const Joi = require('joi');

const Validation = {
    eventPost: Joi.object().keys({
        employerId: Joi.number().required(),
        typeId: Joi.string().required().valid('work start', 'break start', 'break finish', 'temp out start', 'temp out finish', 'work finish', 'comment'),
        sourceId: Joi.string().required().valid('reader', 'www', 'email', 'sms', 'reader - smarthphone', 'application - smartphone', 'panel'),
        datetime: Joi.date().required(),
        // datetimeReal: Joi.string().required(),
        identificator: Joi.string().required(),
        // deviceCode: Joi.string(),
        // location: Joi.string(),
        // locationGps: Joi.string(),
        // gps: Joi.string(),
        comment: Joi.string(),
        eventID: Joi.any(), // Need only for pass a validate.
    })
}

// Validation for event post.
module.exports.eventValidation = (elements, content) => new Promise((res, rej) => {
    prepareForValidate(async result => {
        try {
            const validateData = await Validation.eventPost.validateAsync(result);

            res(validateData);
        } catch(e) {
            if(e instanceof Joi.ValidationError) {
                if(typeof e.details[0] !== "undefined" && typeof e.details[0].context !== "undefined") {
                    rej(`[Error][Validate] ${e.details[0].context.key} is valid, check if data included is correct!`);
                }
            }
        }
    }, elements, content)
});

function prepareForValidate(cb, snap, context) {
    var result = {};

    // Element from snap
    for (const [name, element] of Object.entries(snap)) {
        if (Object.keys(element)[0] == 'mapValue') {
            for(const [mapName, mapElement] of Object.entries(element[Object.keys(element)[0]].fields)) {
                for(const value of Object.entries(mapElement)){
                    TransformName(newName => {
                        result[newName] = value[1];
                    }, mapName)
                }
            }
        } else {
            TransformName(newName => {
                var value = element[Object.keys(element)];
                if (newName == 'datetime') {
                    value = new Date((value.seconds * 1000) + 7200000);
                }
                result[newName] = value;
            }, name)
        }
    }

    // Element from content.
    for (const [name, value] of Object.entries(context.params)) {
        TransformName(newName => {
            result[newName] = value;
        }, name)
    }

    console.log(result);
    cb(result);
}

// THIS FUNCTION RETURN NAMES FROM DATA TRANSFORMER AND REVERSE.
async function TransformName(cb, name) {
    switch(name) {
        case 'type' :
            cb('typeId');
            break;
        case 'typeId':
            cb('type');
            break;
        case 'source':
            cb('sourceId');
            break;
        case 'sourceId':
            cb('source');
            break;
        case 'dateTime':
            cb('datetime');
            break;
        case 'datetime':
            cb('dateTime');
            break;
        case 'employerID':
            cb('employerId');
            break;
        default:
            cb(name);
    }
}
