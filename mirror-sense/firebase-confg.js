var admin = require("firebase-admin");

var serviceAccount = require("./google-services.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://merchant-app-8a468.firebaseio.com/"
})

module.exports.admin = admin