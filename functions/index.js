const functions = require("firebase-functions");
const axios = require('axios');

// MODULES
const modules = require('./modules/token.js');

// Here create a evenet listener to firebase database.
console.log(`Implements Event Listeners`);
exports.onRowCreated = functions.firestore.document("events/{id}")
.onCreate(async (snap, context) => {
    const eventId = context.params['id'];
    const Context = snap._fieldsProto;

    const pass = await PostValidation(Context);
});

function sendPost(data, token) {
    modules.getToken(token => {
        axios({
            method:"POST",
            url: "http://localhost:8000/api/events",
            data: data,
            headers: {
                "accept": "application/ld+json",
                "Authorization": token,
                "Content-Type": "application/ld+json"
            }
        })
    })
}

async function PostValidation(array) {
    var names = {};

    for (const [i, value] of Object.entries(array)) {
        names[i] = true;
    }
    
    await checkNames(names);

}

function checkNames(array) {
    // TODO: Need to establish a value need to send for example: employer id, source id etc..
    var pass = false
    for(const element in array) {
        // TODO
    }

    return pass
}
