import {getApp, getApps, initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getFunctions} from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDVfkdkHiZvNGQ_N7QEVb_nIfo5ziEjfGM",
  authDomain: "saas-translation-8ae2f.firebaseapp.com",
  projectId: "saas-translation-8ae2f",
  storageBucket: "saas-translation-8ae2f.appspot.com",
  messagingSenderId: "850981866388",
  appId: "1:850981866388:web:757c68c5e258ea455e5d81"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export {db, auth, app, functions};