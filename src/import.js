import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc
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

// get collection data
getDocs(colRef)
  .then((snapshot) => {
    let guests = []
    snapshot.docs.forEach((doc) => {
      guests.push({ ...doc.data(), id: doc.id })
    })
    //console.log(guests)
  })



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
        console.log(XLData);
        console.log(XLData.length)
        importExcel();
        document.getElementById("jsondata").innerHTML = JSON.stringify(XLData, undefined, 4)
      });
    }
  }
});

//EXCEL/JSON DATA injecteren in database
function importExcel() {
  for (let i = 0; i < XLData.length; i++) {
    addDoc(colRef, {
      name: XLData[i].Name,
      surname: XLData[i].Surname,
      invitationNumber: XLData[i].invitationNumber,
      inviteToWedding: XLData[i].inviteToWedding,
      inviteToDinner: XLData[i].inviteToDinner,
      rsvpWedding: XLData[i].rsvpWedding,
      rsvpDinner: XLData[i].rsvpDinner,
      plusOneAllowed: XLData[i].plusOneAllowed
    })
  }
}