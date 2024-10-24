import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCQLX3DINMVfw9kXNsMKq5T7mznRj5KjKk",
    authDomain: "goldtrackerhw2.firebaseapp.com",
    projectId: "goldtrackerhw2",
    storageBucket: "goldtrackerhw2.appspot.com",
    messagingSenderId: "642377156095",
    appId: "1:642377156095:web:20b1de62d09042c311d3ca",
    measurementId: "G-431T7MJ2PH"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
