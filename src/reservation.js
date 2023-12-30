//connect to DB
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, getDoc, updateDoc, getDocs, where, query
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
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
    });

onAuthStateChanged(auth, (user) => {
    if (user) {
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
let invitationRequest
let invitationReturn
let guests = []
let guestsKids = []


//get URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let invitationID = urlParams.get('code')

//get invitation
invitationRequest = doc(db, "invitations", invitationID);
try {
    const docSnap = await getDoc(invitationRequest);
    invitationReturn = docSnap.data()
} catch (error) {
    console.log(error)
}


//get Guests based on invitationID
await getGuests()

async function getGuests() {
    //Volwassen gasten opvragen (query) op basis van URL parameter
    const guestQuery = query(GuestsDB, where("invitationID", "==", invitationID), where("isKids", "==", false))
    await getDocs(guestQuery)
        .then(async (snapshot) => {
            guests.length = 0
            snapshot.docs.forEach((doc) => {
                guests.push({ ...doc.data(), id: doc.id })
            })
            await getKids()
            await setLayout()
        })
}

async function getKids() {
    const kidsQuery = query(GuestsDB, where("invitationID", "==", invitationID), where("isKids", "==", true))
    await getDocs(kidsQuery)
        .then(async (snapshot) => {
            guestsKids.length = 0
            console.log(guestsKids)
            snapshot.docs.forEach((doc) => {
                guestsKids.push({ ...doc.data(), id: doc.id })
            })
        })
    console.log(guests)
    console.log(guestsKids[0])
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
    const rsvpForm = document.createElement('form')


    //deel2 - uitnodiging
    const invitationSentence = document.createElement('p')
    let invitationSentenceContent = ""
    if (guests.length > 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor onze ceremonie en bijhorende receptie alsook voor het avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body, rsvpForm)
        SetupEveningPartyRSVP(body, rsvpForm)
    }
    else if (guests.length > 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === false) {
        invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor onze ceremonie en bijhorende receptie en diner.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body, rsvpForm)
    }
    else if (guests.length > 1 && guests[0].inviteToWedding === false && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Jullie zijn uitgenodigd voor ons avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupEveningPartyRSVP(body, rsvpForm)
    }
    else if (guests.length === 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor onze ceremonie en bijhorende receptie en diner alsook voor het avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body, rsvpForm)
        SetupEveningPartyRSVP(body, rsvpForm)
    }
    else if (guests.length = 1 && guests[0].inviteToWedding === true && guests[0].inviteToEveningParty === false) {
        invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor onze ceremonie en bijhorende receptie en diner.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupWeddingRSVP(body, rsvpForm)
    }
    else if (guests.length = 1 && guests[0].inviteToWedding === false && guests[0].inviteToEveningParty === true) {
        invitationSentenceContent = document.createTextNode('Je bent uitgenodigd voor ons avondfeest.')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
        SetupEveningPartyRSVP(body, rsvpForm)

    }
    else {
        invitationSentenceContent = document.createTextNode('KAKA')
        invitationSentence.appendChild(invitationSentenceContent)
        body.appendChild(invitationSentence)
    }

    if (invitationReturn.plusOneAllowed === true && invitationReturn.plusOneInvited === false) {
        await bringPlusOne(body, rsvpForm)
    }
    if (invitationReturn.kidsAllowed === true) {
        await bringKids(body, rsvpForm)
    }
    await SetCheckBoxStates()
    await setCBEventListener()
}

async function bringKids(body, rsvpForm) {

    console.log("in bringKids function")
    console.log(guestsKids)
    const kidsSection = document.createElement('div')
    const kidsQuestion = document.createElement('p')
    const kidsQuestionContent = document.createTextNode('Brengen jullie graag jullie kinderen mee, dat mag zeker.')
    
    let surnameLabel = document.createElement('label');
    surnameLabel.setAttribute('for', 'surname');
    surnameLabel.innerHTML = 'Naam:';

    let surnameInput = document.createElement('input');
    surnameInput.setAttribute('type', 'text');
    surnameInput.setAttribute('id', 'surnameKid');
    surnameInput.setAttribute('name', 'surnameKid');

    let submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('id', 'addKidButton')
    submitButton.innerHTML = 'Voeg kind toe';

    const listOfKids = document.createElement('ul')
    guestsKids.forEach(kid => {
        const kidItem = document.createElement('li')

        const kidNameContent = document.createTextNode(kid.surname)
        const KidCredentials = document.createElement('p')
        const removeKidButton = document.createElement('button');
        removeKidButton.type = 'button';
        removeKidButton.className = 'btn-close btn-removeKid';
        removeKidButton.disabled = false;
        removeKidButton.ariaLabel = 'Remove';
        removeKidButton.id = kid.id;

        kidItem.appendChild(KidCredentials).appendChild(kidNameContent)
        kidItem.appendChild(removeKidButton)
        listOfKids.appendChild(kidItem)
    });

    kidsQuestion.appendChild(kidsQuestionContent)
    kidsSection.appendChild(kidsQuestion)
    kidsSection.appendChild(surnameLabel);
    kidsSection.appendChild(surnameInput);
    kidsSection.appendChild(document.createElement('br'));
    kidsSection.appendChild(submitButton);
    kidsSection.appendChild(listOfKids)
    rsvpForm.appendChild(kidsSection)

    await kidEventlistenerSetup()
    await removeKidEventListenerSetup()
}

async function kidEventlistenerSetup() {
    const kidButton = document.getElementById('addKidButton')
    kidButton.addEventListener('click', event => {
        event.preventDefault
        const surName = document.getElementById('surnameKid').value
        createExtraGuest("", surName, true, false)
    })
}

async function removeKidEventListenerSetup() {
    const removeKidButtons = document.querySelectorAll(".btn-removeKid")
    removeKidButtons.forEach(removeKidButton => {
        removeKidButton.addEventListener('click', (e) => {
            removeKid(e.target.id)
        });
    })
}

async function bringPlusOne(body, rsvpForm) {
    const plusOneQuestion = document.createElement('p')
    const plusOneQuestionContent = document.createTextNode('Breng je graag iemand mee dan mag dat zeker. Geef zijn/haar naam hieronder dan in.')

    let surnameLabel = document.createElement('label');
    surnameLabel.setAttribute('for', 'surname');
    surnameLabel.innerHTML = 'SURNAME:';

    // Create the SURNAME input
    let surnameInput = document.createElement('input');
    surnameInput.setAttribute('type', 'text');
    surnameInput.setAttribute('id', 'surname');
    surnameInput.setAttribute('name', 'surname');

    // Create the LAST NAME label
    let lastnameLabel = document.createElement('label');
    lastnameLabel.setAttribute('for', 'lastname');
    lastnameLabel.innerHTML = 'LAST NAME:';

    // Create the LAST NAME input
    let lastnameInput = document.createElement('input');
    lastnameInput.setAttribute('type', 'text');
    lastnameInput.setAttribute('id', 'lastname');
    lastnameInput.setAttribute('name', 'lastname');

    // Create the submit button
    let submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('id', 'addPlusOneBtn')
    submitButton.innerHTML = 'Voeg jouw plusOne toe';

    // Append all the elements to the form
    plusOneQuestion.appendChild(plusOneQuestionContent)
    rsvpForm.appendChild(plusOneQuestion)
    rsvpForm.appendChild(surnameLabel);
    rsvpForm.appendChild(surnameInput);
    rsvpForm.appendChild(lastnameLabel);
    rsvpForm.appendChild(lastnameInput);
    rsvpForm.appendChild(document.createElement('br'));
    rsvpForm.appendChild(submitButton);
    await plusOneEventlistenerSetup()
}

async function plusOneEventlistenerSetup() {
    const plusOneButton = document.getElementById('addPlusOneBtn')
    plusOneButton.addEventListener('click', event => {

        event.preventDefault
        const lastName = document.getElementById('lastname').value
        const surName = document.getElementById('surname').value
        createExtraGuest(lastName, surName, false, true)
    })
}

async function createExtraGuest(lastName, surName, isKid, isPlusOne) {
    await addDoc(GuestsDB, {
        name: lastName,
        surname: surName,
        invitationID: guests[0].invitationID,
        invitationNumber: guests[0].invitationNumber,
        inviteToWedding: guests[0].inviteToWedding,
        inviteToEveningParty: guests[0].inviteToEveningParty,
        rsvpWedding: false,
        rsvpEveningParty: false,
        isPlusOne: isPlusOne,
        isKids: isKid,
    })
    await updateInvitation(isPlusOne)
    await refreshBrowser()
}

async function removeKid(id){
    await deleteDoc(doc(db,'guests',id))
    await refreshBrowser()
}

async function refreshBrowser() {
    window.location.reload();
}

async function updateInvitation(isPlusOne) {
    if (isPlusOne === true) {
        const docRef = doc(db, 'invitations', invitationID)
        updateDoc(docRef, {
            plusOneInvited: false
        })
    }
}


async function SetupWeddingRSVP(body, rsvpForm) {
    //deel3 - rsvp trouw
    //const rsvpWeddingForm = document.createElement('form')
    const rsvpWeddingQuestion = document.createElement('p')
    let rsvpWeddingQuestionContent = ""
    if (guests.length > 1) {
        rsvpWeddingQuestionContent = document.createTextNode('Zullen jullie aanwezig zijn op onze trouw en bijhorende receptie en diner?')
    }
    else {
        rsvpWeddingQuestionContent = document.createTextNode('Zal je aanwezig zijn op onze trouw en bijhorende receptie en diner?')
    }
    rsvpWeddingQuestion.appendChild(rsvpWeddingQuestionContent)
    rsvpForm.appendChild(rsvpWeddingQuestion)

    guests.forEach(guest => {
        const cbWedding = document.createElement('input')
        cbWedding.setAttribute('type', 'checkbox')
        cbWedding.setAttribute('class', 'rsvpWedding isCheckbox')
        cbWedding.setAttribute('id', guest.id + " Wedding")
        rsvpForm.appendChild(cbWedding)

        const labelWedding = document.createElement('label')
        if (guests.length > 1) {
            labelWedding.innerText = guest.surname
        } else {
            labelWedding.innerText = ""
        }
        labelWedding.setAttribute('for', 'rsvpWedding')
        rsvpForm.appendChild(labelWedding)
        body.appendChild(rsvpForm)
    });
}

async function SetupEveningPartyRSVP(body, rsvpForm) {
    //deel4 - rsvp eveningparty
    const rsvpEveningpartyQuestion = document.createElement('p')
    let rsvpEveningpartyQuestionContent = ""
    if (guests.length > 1) {
        rsvpEveningpartyQuestionContent = document.createTextNode('Zullen jullie aanwezig zijn op ons avondfeest?')
    }
    else {
        rsvpEveningpartyQuestionContent = document.createTextNode('Zal je aanwezig zijn op ons avondfeest?')
    }
    rsvpEveningpartyQuestion.appendChild(rsvpEveningpartyQuestionContent)
    rsvpForm.appendChild(rsvpEveningpartyQuestion)

    guests.forEach(guest => {
        const cbEveningparty = document.createElement('input')
        cbEveningparty.setAttribute('type', 'checkbox')
        cbEveningparty.setAttribute('class', 'rsvpEveningparty isCheckbox')
        cbEveningparty.setAttribute('id', guest.id + " Eveningparty")
        rsvpForm.appendChild(cbEveningparty)

        const labelEveningparty = document.createElement('label')
        if (guests.length > 1) {
            labelEveningparty.innerText = guest.surname
        } else {
            labelEveningparty.innerText = ""
        }
        labelEveningparty.setAttribute('for', 'rsvpEveningparty')
        rsvpForm.appendChild(labelEveningparty)
        body.appendChild(rsvpForm)
    });
}
//zet checkboxes op basis van database
async function SetCheckBoxStates() {
    let checkboxWedding = ""
    let checkboxEveningparty = ""
    guests.forEach(guest => {
        checkboxWedding = document.getElementById(guest.id + " Wedding")
        checkboxWedding.checked = guest.rsvpWedding

        if (guest.inviteToEveningParty === true) {
            checkboxEveningparty = document.getElementById(guest.id + " Eveningparty")
            checkboxEveningparty.checked = guest.rsvpEveningParty
        }
    });
}
//event listener voor alle checkboxes
async function setCBEventListener() {
    const checkboxes = document.querySelectorAll('.isCheckbox')
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const stateOfCheckbox = checkbox.checked;
            const guestInfo = checkbox.id.split(" ");
            const guestID = guestInfo[0]
            const guestTypeOfRsvp = guestInfo[1]
            updateReserveringWedding(guestID, stateOfCheckbox, guestTypeOfRsvp)
        })
    })

}
//webschrijven RSVP naar DB
async function updateReserveringWedding(id, stateOfCheckbox, guestTypeOfRsvp) {
    const docRef = doc(db, 'guests', id)
    if (guestTypeOfRsvp === "Wedding") {
        updateDoc(docRef, {
            rsvpWedding: stateOfCheckbox
        })
    } else if (guestTypeOfRsvp === "Eveningparty") {
        updateDoc(docRef, {
            rsvpEveningParty: stateOfCheckbox
        })
    }
}