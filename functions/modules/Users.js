const admin = require('firebase-admin');

module.exports.getUserById = async (callback, id) => {
    var data = {};
    try {
        admin.firestore().collection("employees").doc(id).get().then(async result => {
            for(const [index, values] of Object.entries(result._fieldsProto)) { // For Each Element we got from query.
                delete values.valueType; // Delete Value type which bug a logic in this loop.
                for(const [type, value] of Object.entries(values)) { // Geting value we need to use.
                    // TODO: If type is number then parseInt etc.
                    data[index] = value;
                }
            }
        }).then(() => {
            // Returning data after all end.
            callback(data);
        })
    } catch(e) {
        console.log(e);
    }
}