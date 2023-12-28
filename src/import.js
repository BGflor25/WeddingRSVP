//connect to DB
import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, doc, updateDoc, getDocs, addDoc
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
        //console.log(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});

const db = getFirestore()
// collection ref
const guestList = collection(db, 'guests')
const invitationsList = collection(db, 'invitations')

let guests = []
getDocs(guestList)
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      guests.push({ ...doc.data(), id: doc.id })
    })
    //console.log(guests)
  })

let invitations = []
getDocs(invitationsList)
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      invitations.push({ ...doc.data(), id: doc.id })
    })
    //console.log(invitations)
  })



//variables
let selectedList = document.getElementById("typeOfImport")

// Bestand selecteren
let selectedFile;
document.getElementById('input').addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
})

//EXCEL converteren
let XLData = []
document.getElementById('importButton').addEventListener("click", () => {
  if (selectedFile) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      console.log(workbook);
      workbook.SheetNames.forEach(sheet => {
        XLData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
        if (selectedList.value == 1) {
          importGuestList()
        }
        if (selectedList.value == 2) {
          importInvitationList()
        }
        document.getElementById("jsondata").innerHTML = JSON.stringify(XLData, undefined, 4)
      });
    }
  }
});

//EXCEL/JSON DATA injecteren in database
function importGuestList() {
  for (let i = 0; i < XLData.length; i++) {
    addDoc(guestList, {
      name: XLData[i].Name,
      surname: XLData[i].Surname,
      invitationNumber: XLData[i].invitationNumber,
      inviteToWedding: XLData[i].inviteToWedding,
      inviteToEveningParty: XLData[i].inviteToAfterDinnerParty,
      rsvpWedding: XLData[i].rsvpWedding,
      rsvpEveningParty: XLData[i].rsvpAfterDinnerParty,
      isPlusOne: XLData[i].isPlusOne,
      isKids: XLData[i].isKids
    })
  }
}

function importInvitationList() {
  for (let i = 0; i < XLData.length; i++) {
    addDoc(invitationsList, {
      shortID: XLData[i].shortID,
      ref: XLData[i].Ref,
      plusOneAllowed: XLData[i].plusOneAllowed,
      plusOneInvited: XLData[i].plusOneInvited,
      kidsAllowed: XLData[i].kidsAllowed,
      kidsInvited: XLData[i].kidsInvited,
    })
  }
}

let syncButton = document.getElementById("syncButton")

syncButton.addEventListener("click", () => {
  syncIDS()
})

async function syncIDS() {
  for (let i = 0; i < guests.length; i++) {
    const searchIndex = invitations.findIndex((invitation) => invitation.shortID == guests[i].invitationNumber);
    await updateGuestList(guests[i].id, invitations[searchIndex].id)
  }
  console.log(guests)
}

async function updateGuestList(guestsID, id) {
  const docRef = doc(db, 'guests', guestsID)
  await updateDoc(docRef, {
    invitationID: id
  })
}