// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
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
  measurementId: "G-B62G6N92SB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Create a child reference
export const imagesItemRef = ref(storage, "Items/Images");
export const drawingsRef = ref(storage, "Items/Drawings");
export const imagesMaterialRef = ref(storage, "Materials/Images");
export const imagesReportRef = ref(storage, "Reports/Images");
export const imagesProfileRef = ref(storage, "Profiles/Images");
export const quotesRef = ref(storage, "Orders/Quotes");
export const contractsRef = ref(storage, "Orders/Contracts");
export const leaderTaskReportsRef = ref(storage, "Report/LeaderTask/Images");
export const workerTaskReportsRef = ref(storage, "Report/WorkerTask/Images");

export default storage;
