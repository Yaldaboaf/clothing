import { initializeApp } from 'firebase/app';

import {
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Firestore,
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCXJJF_EO9_5yQ6rC81P4ZkEhmKIP3CQDU",
    authDomain: "crwn-clothing-db-ed478.firebaseapp.com",
    projectId: "crwn-clothing-db-ed478",
    storageBucket: "crwn-clothing-db-ed478.appspot.com",
    messagingSenderId: "77362479495",
    appId: "1:77362479495:web:79ac4f28fe071855cdd322"
};
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
})
  
export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, ...add) => {
  if (!userAuth) return; 
  const userDocRef = doc(db, 'users', userAuth.uid);  
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()){
    const { displayName, email }= userAuth;
    const createAt = new Date();
    try { 
      await setDoc(userDocRef, { displayName, email , createAt, ...add });
    } catch ( error ) { 
      console.log(error.message);
    }
  }
  return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if ( !email || !password ) return;
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if ( !email || !password ) return;
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged (auth, callback); 