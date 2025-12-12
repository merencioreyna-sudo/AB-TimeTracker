// Configuración ORIGINAL corregida
const firebaseConfig = {
    apiKey: "AIzaSyBHz_JHDItRfyOI9wx-RhHgFqVNrQeN_ks",
    authDomain: "ab-timetracker.firebaseapp.com",
    projectId: "ab-timetracker",
    storageBucket: "ab-timetracker.appspot.com",
    messagingSenderId: "1054161107782",
    appId: "1:1054161107782:web:9f624494525cc969778347"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Hacer accesible Auth en toda la app
window.auth = firebase.auth();
