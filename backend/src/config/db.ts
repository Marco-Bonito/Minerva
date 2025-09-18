import admin from 'firebase-admin';

const serviceAccount = require('./minerva-book-firebase-adminsdk-fbsvc-a50585e96f.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export default db;
