// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt6CLBwQrURiYbrIyYGYxPD_OPUC9ktBs",
  authDomain: "capstonebwm.firebaseapp.com",
  projectId: "capstonebwm",
  storageBucket: "capstonebwm.appspot.com",
  messagingSenderId: "686635558120",
  appId: "1:686635558120:web:c9ddccfc88fee93ca3955d",
  measurementId: "G-B62G6N92SB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Begin 

const getListItems = async (db, collectionName) => {
  const collection = collection(db, collectionName);
  const snapshot = await getDocs(collection);
  const itemList = snapshot.docs.map(doc => doc.data());
  return itemList;
}

// End