//connect to DB
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    doc, getDoc, updateDoc,
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

const cbAvondfeest = document.getElementById("cbAvondfeest");


// init firebase app
initializeApp(firebaseConfig)

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



//gasten opvragen (query) op basis van URL parameter
const guestQuery = query(GuestsDB, where("invitationID", "==", invitationID))
let guests = []
onSnapshot(guestQuery, (snapshot) => {
    guests.length = 0
    snapshot.docs.forEach((doc) => {
        guests.push({ ...doc.data(), id: doc.id })
    })
    console.log(guests)
    setLayout()
    //updateCheckboxes();
})

function setLayout() {
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
    else{
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
    if(guests.length > 1){
        rsvpWeddingQuestionContent = document.createTextNode('Zullen jullie aanwezig zijn op onze trouw en bijhorende receptie?')
    }
    else{
        rsvpWeddingQuestionContent = document.createTextNode('Zal je aanwezig zijn op onze trouw en bijhorende receptie?')
    }
    rsvpWeddingQuestion.appendChild(rsvpWeddingQuestionContent)
    rsvpWeddingForm.appendChild(rsvpWeddingQuestion)

    const cbWedding1 = document.createElement('input')
    cbWedding1.setAttribute('type','checkbox')
    cbWedding1.setAttribute('name','rsvpWeddingGuest1')
    cbWedding1.setAttribute('id','0')
    rsvpWeddingForm.appendChild(cbWedding1)

    if(guests.length > 1){
        const labelWedding1 = document.createElement('label')
        labelWedding1.innerText = guests[0].surname
        labelWedding1.setAttribute('for','rsvpWeddingGuest1')
        rsvpWeddingForm.appendChild(labelWedding1)

        const cbWedding2 = document.createElement('input')
        cbWedding2.setAttribute('type','checkbox')
        cbWedding2.setAttribute('name','rsvpWeddingGuest2')
        cbWedding2.setAttribute('id','1')
        const labelWedding2 = document.createElement('label')
        labelWedding2.innerText = guests[1].surname
        labelWedding2.setAttribute('for','rsvpWeddingGuest2')
        rsvpWeddingForm.appendChild(cbWedding2)
        rsvpWeddingForm.appendChild(labelWedding2)
    }


    body.appendChild(rsvpWeddingForm)
}

//nog uit te werken
/*function hasKids() {

}*/

//reservatie trouw klik-event
const cbWeddingGuest1 = document.getElementById("0");
const cbWeddingGuest2 = document.getElementById("1");

cbWeddingGuest1.addEventListener('change', function () {
    updateReservering()
});
cbWeddingGuest2.addEventListener('change', function () {
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


