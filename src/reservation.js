//connect to DB
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    doc, getDoc, updateDoc, getDocs,
    where, query
} from 'firebase/firestore'
import {
    getAuth, signInAnonymously, onAuthStateChanged
} from 'firebase/auth'


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

const auth = getAuth();
signInAnonymously(auth)
    .then(() => {
        console.log(auth.config)
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
    });

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});





const cbAvondfeest = document.getElementById("cbAvondfeest");



// init services
const db = getFirestore()
// collection ref
const GuestsDB = collection(db, 'guests')


//get URL parameters

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let invitationID = urlParams.get('code')

const invitation = doc(db, "invitations", invitationID);
try {
    const docSnap = await getDoc(invitation);
    console.log(docSnap.data());
} catch (error) {
    console.log(error)
}

let guests = []

getGuests()

async function getGuests() {
    //gasten opvragen (query) op basis van URL parameter
    const guestQuery = query(GuestsDB, where("invitationID", "==", invitationID))
    
    getDocs(guestQuery)
    .then(async (snapshot) => {
        guests.length = 0
        snapshot.docs.forEach((doc) => {
            guests.push({ ...doc.data(), id: doc.id })
        })
        await setLayout()
        await SetCheckBoxStates()
        await setCBEventListener()
    })
}

async function setLayout() {
    //aanmaken titel
    const title = document.createElement('h1')

    const name1 = document.createElement('div')
    name1.setAttribute('id', 'name1')
    const name1Content = document.createTextNode(guests[0].surname)
    name1.appendChild(name1Content)
    let titleContent = ""
    if (guests.length > 1) {
        const name2 = document.createElement('div')
        name2.setAttribute('id', 'name2')
        const name2Content = document.createTextNode(guests[1].surname)
        name2.appendChild(name2Content)
        titleContent = document.createTextNode('Hallo ' + name1.innerText + ' en ' + name2.innerText)
    }
    else {
        titleContent = document.createTextNode('Hallo ' + name1.innerText)
    }
    title.appendChild(titleContent)
    const body = document.querySelector('body')
    body.appendChild(title)

    //deel2 - uitnodiging
    const invitationSentence = document.createElement('p')
    let invitationSentenceContent = ""
    if (guests.length > 1) {
        if (invitation.inviteToDinner === true) {
            invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor onze trouw en bijhorende receptie alsook voor het avondfeest.')
        }
        else {
            invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor onze trouw en bijhorende receptie.')
        }
    }
    else {
        if (invitation.inviteToDinner === true) {
            invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor onze trouw en bijhorende receptie alsook voor het avondfeest.')
        }
        else {
            invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor onze trouw en bijhorende receptie.')
        }
    }
    invitationSentence.appendChild(invitationSentenceContent)
    body.appendChild(invitationSentence)

    //deel3 - rsvp trouw
    const rsvpWeddingForm = document.createElement('form')
    const rsvpWeddingQuestion = document.createElement('p')
    let rsvpWeddingQuestionContent = ""
    if (guests.length > 1) {
        rsvpWeddingQuestionContent = document.createTextNode('Zullen jullie aanwezig zijn op onze trouw en bijhorende receptie?')
    }
    else {
        rsvpWeddingQuestionContent = document.createTextNode('Zal je aanwezig zijn op onze trouw en bijhorende receptie?')
    }
    rsvpWeddingQuestion.appendChild(rsvpWeddingQuestionContent)
    rsvpWeddingForm.appendChild(rsvpWeddingQuestion)


    guests.forEach(guest => {
        const cbWedding = document.createElement('input')
        cbWedding.setAttribute('type', 'checkbox')
        cbWedding.setAttribute('class', 'rsvpWeddingGuest')
        cbWedding.setAttribute('id', guest.id)
        rsvpWeddingForm.appendChild(cbWedding)

        const labelWedding = document.createElement('label')
        labelWedding.innerText = guest.surname
        labelWedding.setAttribute('for', 'rsvpWeddingGuest')
        rsvpWeddingForm.appendChild(labelWedding)
        body.appendChild(rsvpWeddingForm)
    });    
}

//reservatie trouw klik-event

async function SetCheckBoxStates(){
    guests.forEach(guest => {
        console.log(guest.id)
        document.getElementById(guest.id).checked = guest.rsvpWedding;
    });
}


async function setCBEventListener(){
    const cbWeddingGuests = document.querySelectorAll(".rsvpWeddingGuest")
    const handleChange = (e) => {
        const clickedCheckboxId = e.target.id;
        const stateOfCheckbox = e.target.checked;
        updateReservering(clickedCheckboxId, stateOfCheckbox);
    };
    cbWeddingGuests.forEach(function(cbWeddingGuest){
        cbWeddingGuest.addEventListener('change', handleChange);
    })
}

//functie cbs wegschrijven naar DB
function updateReservering(id, stateOfCheckbox) {
    console.log("triggered")
    const docRef = doc(db, 'guests', id)
        updateDoc(docRef, {
            rsvpWedding: stateOfCheckbox
        })
}

