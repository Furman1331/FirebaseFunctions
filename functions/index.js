const functions = require("firebase-functions");
// const EventListener = require("./listener/FirestoreEventListener.js");

// class App {
//     constructor() {
//         this.init();
//     }

//     init() {
//         new EventListener()
//     }
// }

// Here create a evenet listener to firebase database.
console.log(`Implements Event Listeners`);
exports.onRowCreated = functions.firestore.document("events/{id}")
.onCreate(async (snap, context) => {
    const eventId = context.params['id'];
    const Context = snap._fieldsProto;

    const pass = await PostValidation(Context)
    // console.log(Context);

    // console.log('snap', snap);
    // console.log('content', context);
});

const defaultPost = {
    
}
async function PostValidation(array) {
    var names = {};

    for (const [i, value] of Object.entries(array)) {
        names[i] = true;
    }

    await checkNames(names) ? console.log('Pass names test') : console.log('Names test falied');
}

function checkNames(array) {
    var pass = false
    for(const element in array) {
        console.log(element)
    }

    return true
}
