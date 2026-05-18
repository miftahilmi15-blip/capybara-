/* ==========================================================================
   CAPY SOVEREIGN OS - FIREBASE INITIALIZATION GATEWAY
   Konfigurasi SDK Firebase Legacy Compat untuk Sinkronisasi Realtime Cloud
   ========================================================================== */

// Masukkan konfigurasi akun Firebase Console lu di bawah ini, Taf
const firebaseConfig = {
    apiKey: "AIzaSyAxXXXXXXXXXXXX_YOUR_API_KEY_XXXXXXXX",
    authDomain: "capybara-xxxxxx.firebaseapp.com",
    projectId: "capybara-xxxxxx",
    storageBucket: "capybara-xxxxxx.appspot.com",
    messagingSenderId: "XXXXXXXXXXXX",
    appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX"
};

// Pastikan SDK Firebase di index.html sudah termuat sempurna sebelum diinisialisasi
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    console.error("Firebase SDK Core Libs not detected! Check your global index.html script tags.");
}

// Ekspor instance database Firestore untuk digunakan oleh Engine Inti
export const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
