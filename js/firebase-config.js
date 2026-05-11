import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDYg5ad2YqA4W1GzzhWeDQskqy0hUQiqo0",
    authDomain: "gp22-b3eb7.firebaseapp.com",
    databaseURL: "https://gp22-b3eb7-default-rtdb.firebaseio.com",
    projectId: "gp22-b3eb7",
    storageBucket: "gp22-b3eb7.firebasestorage.app",
    messagingSenderId: "46504135011",
    appId: "1:46504135011:web:862551a72c9ee31b602b56",
    measurementId: "G-594R6EPRC6"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
 const storage = getStorage(app);
export { db, auth, storage };