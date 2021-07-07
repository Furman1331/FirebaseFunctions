// https://stackoverflow.com/questions/66416001/parsing-error-unexpected-token-when-trying-to-deploy-firebase-cloud-function
// Problem with deploy is fix by seting rules to only warning, but in future need to rebuild javascript runes in .eslintrc.js

// Firebase Untils.
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const database = admin.firestore();

// Node.js Untils.
const axios = require("axios");

// Modules
const Validation = require("./validation/Validation.js");
const tokenModule = require("./modules/token.js");

// Here create a evenet listener to firebase database.
console.log(`Starting application`);
exports.onEventCreated = functions.region('europe-central2').firestore.document("employees/{employerID}/events/{eventID}")
    .onCreate(async (snap, context) => {
        checkIdExist(async () => {
            Validation.eventValidation(snap._fieldsProto, context).then(data => {
                sendPost(data);
            }).catch((e) => {
                console.error(e);
            });
        }, snap._fieldsProto)
});

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
                setNewIdFromPath(response.headers['content-location'], data)
                    .then(() => {
                        console.log(`[API] Updating end. All Done!`);
                    }).catch((err) => {
                        console.error(err);
                    })
            }).catch((response) => {
                response
                    ? console.log(response.response.data)
                    : console.log(`[Error][API] Cannot connect to API !`)
            })
        : console.error(`[ERORR] Cannot get Token!`)
    });
};

async function checkIdExist(pass, array) {
    if(typeof array.id !== 'undefined') {
        console.error(`[ERROR] This row exist not pass!`);
    } else {
        pass();
    }
}

const setNewIdFromPath = (path, data) => new Promise((res, rej) => {
    const find = path.match(/\d+/); // Regex find one digital or more. and give a index and a numbers.
    if(find[0] == path.substring(find.index)) {
        database.collection("employees").doc((data.employerId).toString()).collection('events').doc((data.eventID).toString()).update({'id':parseInt(find[0])});
    } else {
        console.error(`ID from regex and stringsub is not the same.`);
    }
});