import { initializeApp,getApps,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD0GHuGB3WZxSdTO3VymnKlxPDxb3GDeHg",
  authDomain: "notion-clone-a3549.firebaseapp.com",
  projectId: "notion-clone-a3549",
  storageBucket: "notion-clone-a3549.firebasestorage.app",
  messagingSenderId: "845014210788",
  appId: "1:845014210788:web:73214a99f3f0a1fea734f1"
};

const app=getApps().length ? getApp() : initializeApp(firebaseConfig);
const db=getFirestore(app);

export {db};