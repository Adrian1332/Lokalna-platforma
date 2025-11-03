import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCVXqA-O5QTGDDfoMEkuqLCletRcgdaP54",
  authDomain: "lokalna-platforma.firebaseapp.com",
  projectId: "lokalna-platforma",
  storageBucket: "lokalna-platforma.appspot.com",
  messagingSenderId: "93498784537",
  appId: "1:93498784537:web:1917e6276eb3c7cca4e388",
  measurementId: "G-4CFNGPWKV5"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
