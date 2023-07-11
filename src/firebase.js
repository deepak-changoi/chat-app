import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmJmCjbjySevPKj0cV2I8Apxlk5pSK4wo",
  authDomain: "chat-app-d7a9d.firebaseapp.com",
  databaseURL: "https://chat-app-d7a9d-default-rtdb.firebaseio.com",
  projectId: "chat-app-d7a9d",
  storageBucket: "chat-app-d7a9d.appspot.com",
  messagingSenderId: "948099693635",
  appId: "1:948099693635:web:5bdce1a91f8fbb70f468f6",
  measurementId: "G-SXHZDM5R3D"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider= new firebase.auth.GoogleAuthProvider();

  export { auth , provider};
  export default db;
  