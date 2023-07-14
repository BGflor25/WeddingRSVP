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
    console.log(guests)
  })

const addGuestForm = document.getElementById('addGuest')

addGuestForm.addEventListener('submit', (event => {
  event.preventDefault()
  addDoc(colRef, {
    name: addGuestForm.lname.value,
    surname: addGuestForm.fname.value,
  })
    .then(() => {
      console.log("Document has been added succesfully")
      addGuestForm.reset()
    })
}))

const deleteGuestForm = document.getElementById('deleteGuest')

deleteGuestForm.addEventListener('submit', (event => {
  event.preventDefault()
  const docRef = doc(db, 'guests', deleteGuestForm.id.value)
  deleteDoc(docRef)
    .then(
      console.log("Document has been removed succesfully")
    )
    .then(() => {
      deleteGuestForm.reset()
    })
}))