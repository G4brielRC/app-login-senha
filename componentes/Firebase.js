import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { setFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNlRZ-X3WS94dQV65vCPeo5v_oaXTxNaE",
  authDomain: "login-senha-8d490.firebaseapp.com",
  projectId: "login-senha-8d490",
  storageBucket: "login-senha-8d490.firebasestorage.app",
  messagingSenderId: "26137925801",
  appId: "1:26137925801:web:466b920e1361c6db6331b8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };