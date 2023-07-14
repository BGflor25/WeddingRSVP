//connect to DB
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, onSnapshot,
    addDoc, deleteDoc, doc,
    where, query
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBML3R1uUh8pkGGtqDqJZ74LdRq1vZomFM",
    authDomain: "hanneflorewedding.firebaseapp.com",
    projectId: "hanneflorewedding",
    storageBucket: "hanneflorewedding.appspot.com",
    messagingSenderId: "926634763848",
    appId: "1:926634763848:web:87b79b4bcd09cff39b1a7d"
}

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'guests')
//get URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let invitationNumber = urlParams.get('code')


console.log(invitationNumber)

//DB gegevens opvragen (query) op basis van URL parameter

const q = query(colRef, where("invitationNumber", "==", parseInt(invitationNumber)))
    onSnapshot(q, (snapshot) => {
        let guests = []
        snapshot.docs.forEach((doc) => {
            guests.push({ ...doc.data(), id: doc.id })
        })
        console.log(guests)
    })


