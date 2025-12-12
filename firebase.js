// Firebase v10 USANDO SDK CLÁSICO (GARANTIZADO EN GITHUB PAGES)

const firebaseConfig = {
    apiKey: "AIzaSyBHz_JHDItRfyOI9wx-RhHgFqVNrQeN_ks",
    authDomain: "ab-timetracker.firebaseapp.com",
    projectId: "ab-timetracker",
    storageBucket: "ab-timetracker.appspot.com",
    messagingSenderId: "1054161107782",
    appId: "1:1054161107782:web:9f624494525cc969778347"
};

firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();

console.log("FIREBASE JS CARGADO");

