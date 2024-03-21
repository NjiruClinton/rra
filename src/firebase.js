import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
config

};


const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);

export {auth, db}