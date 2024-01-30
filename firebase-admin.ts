import {initFirestore} from "@auth/firebase-adapter";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

let app;

if(!admin.apps.length){
    app = admin.initializeApp({
        credential:cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
    });
}

const adminDb = initFirestore({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
});

const adminAuth = admin.auth(app);

export {adminDb, adminAuth};