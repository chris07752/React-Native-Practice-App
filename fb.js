import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI2C-qmPAVQ3D_7VSFz3ydJKs-aNNiqTA",
  authDomain: "woodbridge-4d0e0.firebaseapp.com",
  projectId: "woodbridge-4d0e0",
  storageBucket: "woodbridge-4d0e0.appspot.com",
  messagingSenderId: "609850993012",
  appId: "1:609850993012:web:a1cbf9cbdd850a2a10e421",
  measurementId: "G-4KJ3VT0Q2P"
};

if (firebase.apps && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export { firebase };