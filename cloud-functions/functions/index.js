const admin = require('firebase-admin');
const functions = require('firebase-functions');
const TOPIC = "all";

admin.initializeApp(functions.config().firebase);

exports.sendPush = functions.database.ref('/fights/{fightId}').onWrite(snapshot => {
    const fightData = snapshot.data.val();

    console.log(TOPIC);
    return admin.messaging().sendToTopic(TOPIC, {
        data: fightData
    });
});

exports.subscribeToTopic = functions.database.ref('/tokens/{tokenId}').onWrite(snapshot => {
    const registrationToken = snapshot.data.key;

    return admin
        .messaging()
        .subscribeToTopic(registrationToken, TOPIC)
        .then(response => {
            console.log('Successfully subscribed to topic:', response);
        })
        .catch(error => {
            console.error('Error subscribing to topic:', error);
        });
});