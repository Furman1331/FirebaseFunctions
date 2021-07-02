const functions = require("firebase-functions");
const axios = require('axios');
const ValidationError = require('joi').ValidationError;

// MODULES
const Validation = require('./validation/Validation');

const modules = require('./modules/token.js');

// Here create a evenet listener to firebase database.
console.log(`Starting application`);
exports.onRowCreated = functions.firestore.document("events/{id}")
.onCreate(async (snap, context) => {
    try {
        const result = await prepareForValidate(snap._fieldsProto);
        Validation.eventValidation(data => {
            data
                ? sendPost(data)
                : console.log(`Falied to get callback from validataion`);
        }, result);
    } catch (e) {
        if(e instanceof ValidationError) {
            if(typeof e.details[0] !== "undefined" && typeof e.details[0].context !== "undefined") {
                // TODO
            }
        }
    }
});

function prepareForValidate(array) {
    var result = {};

    for (const [index, value] of Object.entries(array)) {
        // TODO: Add exception for a array type.
        // if(Object.keys(value)[0])

        result[index] = value[Object.keys(value)[0]];
    }

    return result;
}

function sendPost(data) {
    modules.getToken(token => {
        axios({
            method:"POST",
            url: "http://localhost:8000/api/events",
            data: data,
            headers: {
                "accept": "application/ld+json",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/ld+json"
            }
        }).then((response) => {
            console.log(response);
        }).catch((response) => {
            console.log(response);
        })
    })
}