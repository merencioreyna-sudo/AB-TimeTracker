import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHz_JHDItRfyOI9wx-RhHgFqVNrQeN_ks",
  authDomain: "ab-timetracker.firebaseapp.com",
  projectId: "ab-timetracker",
  storageBucket: "ab-timetracker.appspot.com",
  messagingSenderId: "1054161107782",
  appId: "1:1054161107782:web:9f624494525cc969778347"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
