import { initializeApp } from "firebase/app"
import {
    getAuth, signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged
} from 'firebase/auth'
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBML3R1uUh8pkGGtqDqJZ74LdRq1vZomFM",
    authDomain: "hanneflorewedding.firebaseapp.com",
    projectId: "hanneflorewedding",
    storageBucket: "hanneflorewedding.appspot.com",
    messagingSenderId: "926634763848",
    appId: "1:926634763848:web:87b79b4bcd09cff39b1a7d"
}
console.log("btn was clicked")

// init firebase app
const app = initializeApp(firebaseConfig)


//init services
const db = getFirestore()
const auth = getAuth()

//logging in
const loginBtn = document.querySelector('.login')
loginBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginBtn.email.value
    const password = loginBtn.password.value
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            const user = cred.user
            console.log('user logged in:', cred.user)
        })
        .catch((err) => {
            console.log(err.message)
        })
})
const loginAnoBtn = document.getElementById("loginAno")
loginAnoBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log("btn was clicked")

    

})