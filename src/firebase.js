import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBheNKkFRyhgYhG5WOTvRuqfKlluQtF95g",
  authDomain: "robotalliance-2f5c0.firebaseapp.com",
  projectId: "robotalliance-2f5c0",
  storageBucket: "robotalliance-2f5c0.firebasestorage.app",
  messagingSenderId: "50456892599",
  appId: "1:50456892599:web:431ddc72c107d17879e932"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
