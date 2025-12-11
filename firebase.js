import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Config de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyBHz_JHDITRfYOl9wx-RhHGfQVNrQeN_kS",
  authDomain: "ab-timetracker.firebaseapp.com",
  projectId: "ab-timetracker",
  storageBucket: "ab-timetracker.appspot.com",
  messagingSenderId: "1054161107782",
  appId: "1:1054161107782:web:9f624494525cc969778347"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta módulos
export const auth = getAuth(app);
export const db = getDatabase(app);
