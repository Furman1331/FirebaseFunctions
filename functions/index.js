// https://stackoverflow.com/questions/66416001/parsing-error-unexpected-token-when-trying-to-deploy-firebase-cloud-function
// Problem with deploy is fix by seting rules to only warning, but in future need to rebuild javascript runes in .eslintrc.js

// UTILS
const functions = require("firebase-functions");

const axios = require("axios");
const admin = require('firebase-admin');
admin.initializeApp();

// MODULES
const Validation = require("./validation/Validation.js");
const tokenModule = require("./modules/token.js");
const UserModule = require('./modules/Users.js');

// Here create a evenet listener to firebase database.
console.log(`Starting application`);
exports.onEventCreated = functions.region('europe-central2').firestore.document("employees/{employerID}/events/{eventID}")
    .onCreate(async (snap, context) => {
        checkIdExist(async (pass) => {
            try {
                prepareForValidate(result => {
                    Validation.eventValidation(data => {
                        if (data) {
                            sendPost(data)
                        } else {
                            console.log(`Falied to get callback from validataion`);
                        }
                    }, result);
                }, snap._fieldsProto, context); // Preparing data to Validate
            } catch (e) {
                console.log(e);
            }
        }, snap._fieldsProto)
});

// OTHER FUNCTIONS
function prepareForValidate(cb, array, context) {
    var result = {};

    for (const [name, value] of Object.entries(array)) {
        if(Object.keys(value)[0] == 'arrayValue') {
            // TODO: IF ARRAY THEN...
        } else {
            TransformName(newName => {
                result[newName] = value[Object.keys(value)];
            }, name)
        }
    }

    cb(result);
}
//todo fix monday  event bad
function sendPost(data) {
    tokenModule.getToken(token => {
        token ?
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
                console.log(`[API] Post Send!`)
                console.log(response);
                // TODO: after get response update ID in firestore.
            }).catch((response) => {
                response
                    ? console.log(response.response.data)
                    : console.log(`[Error][API] Cannot connect to API !`)
            })
        : console.log(`[ERORR] Cannot get Token!`)
    });
};

async function checkIdExist(pass, array) {
    if(typeof array.id !== 'undefined') {
        console.log(`[ERROR] This event exist not pass!`);
    } else {
        pass();
    }
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
        default:
            cb(name);
    }
}