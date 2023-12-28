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
await signInAnonymously(auth)
    .then(() => {
        //console.log(auth.config)
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

// init services
const db = getFirestore()
// collection ref
const GuestsDB = collection(db, 'guests')
let invitation
let guests = []

//get URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let invitationID = urlParams.get('code')

//get invitation
invitation = doc(db, "invitations", invitationID);
try {
    const docSnap = await getDoc(invitation);
    //console.log(docSnap.data());
    invitation = docSnap.data()
} catch (error) {
    console.log(error)
}
console.log(invitation)


//get Guests based on invitationID
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
            //await SetCheckBoxStates()
            //await setCBEventListener()
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
    console.log(guests.length + "/" + guests[0].inviteToWedding + "/" + guests[0].inviteToEveningParty)
    const invitationSentence = document.createElement('p')
    let invitationSentenceContent = ""
    if (guests.length > 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor onze ceremonie en bijhorende receptie alsook voor het avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body)
        SetupDinnerPartyRSVP(body)
        await SetCheckBoxStates()
        await setCBEventListener()
    }
    else if (guests.length > 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === false) {
        invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor onze ceremonie en bijhorende receptie.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body)
        await SetCheckBoxStates()
        await setCBEventListener()
    }
    else if (guests.length > 1 && guests[0].inviteToWedding === false && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor ons avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupDinnerPartyRSVP(body)
        await SetCheckBoxStates()
        await setCBEventListener()
    }
    else if (guests.length === 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor onze ceremonie en bijhorende receptie alsook voor het avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body)
        SetupDinnerPartyRSVP(body)
        await SetCheckBoxStates()
        await setCBEventListener()
    }
    else if (guests.length = 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === false) {
        invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor onze ceremonie en bijhorende receptie.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body)
        await SetCheckBoxStates()
        await setCBEventListener()
    }
    else if (guests.length = 1 && guests[0].inviteToWedding === false && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor ons avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupDinnerPartyRSVP(body)
        await SetCheckBoxStates()
        await setCBEventListener()
    }
    else {
        invitationSentenceContent = document.createTextNode('KAKA')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
    }
}

async function SetupWeddingRSVP(body) {
    console.log("entered Wedding Setup")
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
        cbWedding.setAttribute('class', 'rsvpWedding isCheckbox')
        cbWedding.setAttribute('id', guest.id + " Wedding")
        rsvpWeddingForm.appendChild(cbWedding)

        const labelWedding = document.createElement('label')
        labelWedding.innerText = guest.surname
        labelWedding.setAttribute('for', 'rsvpWedding')
        rsvpWeddingForm.appendChild(labelWedding)
        body.appendChild(rsvpWeddingForm)
    });
}

async function SetupDinnerPartyRSVP(body) {
    //deel4 - rsvp dinnerparty
    const rsvpDinnerpartyForm = document.createElement('form')
    const rsvpDinnerpartyQuestion = document.createElement('p')
    let rsvpDinnerpartyQuestionContent = ""
    if (guests.length > 1) {
        rsvpDinnerpartyQuestionContent = document.createTextNode('Zullen jullie aanwezig zijn op ons avondfeest?')
    }
    else {
        rsvpDinnerpartyQuestionContent = document.createTextNode('Zal je aanwezig zijn op ons avondfeest?')
    }
    rsvpDinnerpartyQuestion.appendChild(rsvpDinnerpartyQuestionContent)
    rsvpDinnerpartyForm.appendChild(rsvpDinnerpartyQuestion)

    guests.forEach(guest => {
        const cbDinnerparty = document.createElement('input')
        cbDinnerparty.setAttribute('type', 'checkbox')
        cbDinnerparty.setAttribute('class', 'rsvpDinnerparty isCheckbox')
        cbDinnerparty.setAttribute('id', guest.id + " Dinnerparty")
        rsvpDinnerpartyForm.appendChild(cbDinnerparty)

        const labelDinnerparty = document.createElement('label')
        labelDinnerparty.innerText = guest.surname
        labelDinnerparty.setAttribute('for', 'rsvpDinnerparty')
        rsvpDinnerpartyForm.appendChild(labelDinnerparty)
        body.appendChild(rsvpDinnerpartyForm)
    });
}

//zet checkboxes op basis van database
async function SetCheckBoxStates() {
    let checkboxWedding = ""
    let checkboxDinnerparty = ""
    guests.forEach(guest => {
        checkboxWedding = document.getElementById(guest.id + " Wedding")
        checkboxWedding.checked = guest.rsvpWedding

        if (guest.inviteToEveningParty === true) {
            checkboxDinnerparty = document.getElementById(guest.id + " Dinnerparty")
            checkboxDinnerparty.checked = guest.rsvpEveningParty
        }
    });
}

//event listener voor alle checkboxes
async function setCBEventListener() {
    const checkboxes = document.querySelectorAll('.isCheckbox')
    console.log(checkboxes)
    checkboxes.forEach(checkbox =>{
        checkbox.addEventListener('click', () => {
            const stateOfCheckbox = checkbox.checked;
            const guestInfo = checkbox.id.split(" ");
            const guestID = guestInfo[0]
            const guestTypeOfRsvp = guestInfo [1]
            updateReserveringWedding(guestID,stateOfCheckbox,guestTypeOfRsvp)
        })
    })
    
}

//webschrijven naar DB
async function updateReserveringWedding(id, stateOfCheckbox, guestTypeOfRsvp) {
    console.log("triggered")
    const docRef = doc(db, 'guests', id)
    if(guestTypeOfRsvp === "Wedding"){
        updateDoc(docRef, {
            rsvpWedding: stateOfCheckbox
        })
    }else if(guestTypeOfRsvp === "Dinnerparty"){
        updateDoc(docRef, {
            rsvpEveningParty: stateOfCheckbox
        })
    }
    else{
        console.log("kakaaka")
    }   
}