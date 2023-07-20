//connect to DB
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, onSnapshot,
    addDoc, deleteDoc, doc, updateDoc,
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

const cbTrouw = document.getElementById("cbTrouw");
const cbAvondfeest = document.getElementById("cbAvondfeest");


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
let guests = []
onSnapshot(q, (snapshot) => {
    guests.length = 0
    snapshot.docs.forEach((doc) => {
        guests.push({ ...doc.data(), id: doc.id })
    })
    console.log(guests)
    let name1 = document.getElementById("name1")
    let name2 = document.getElementById("name2")
    if (guests.length >= 2) {
        name1.innerText = guests[0].surname
        name2.innerText = guests[1].surname
        document.getElementById("aantalPersonen1").innerText = "Jullie zijn"
        document.getElementById("aantalPersonen2").innerText = "Zijn jullie "
        document.getElementById("aantalPersonen3").innerText = "Zijn jullie "
    }
    else if (guests.length == 1) {
        document.getElementById("moreThanOneGuest").remove()
        document.getElementById("name2").remove()
        name1.innerText = guests[0].surname
        document.getElementById("aantalPersonen1").innerText = "Je bent "
        document.getElementById("aantalPersonen2").innerText = "Ben je "
    }
    if (guests[0].inviteToDinner === false) {
        document.getElementById("avondfeest1").remove()
        document.getElementById("avondfeest2").remove()
    }
    updateCheckboxes();
})

//reservatie trouw klik-event

cbTrouw.addEventListener('change', function () {
    updateReservering()
});

//reservatie avondfeest klik-event

cbAvondfeest.addEventListener('change', function () {
    updateReservering()
});

//functie cbs wegschrijven naar DB
function updateReservering() {
    for (let i = 0; i < guests.length; i++) {
        const docRef = doc(db, 'guests', guests[i].id)
        updateDoc(docRef, {
            rsvpWedding: cbTrouw.checked,
            rsvpDinner: cbAvondfeest.checked
        })
    }
}
function updateCheckboxes() {
    if (guests[0].rsvpWedding === true) {
        cbTrouw.checked = true
    }
    if (guests[0].rsvpDinner === true) {
        cbAvondfeest.checked = true
    }
}

