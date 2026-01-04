import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgb2zBEIzfrqTPMlPDYNXuG7bzIb0j_7w",
  authDomain: "careertracker-aaddf.firebaseapp.com",
  projectId: "careertracker-aaddf",
  storageBucket: "careertracker-aaddf.appspot.com",  
  messagingSenderId: "334711286034",
  appId: "1:334711286034:web:bfe8622609f308d786abcb"
};

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' FIREBASE CONFIGURATION CHECK');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('\n📋 Current Configuration:');
console.log('apiKey:', firebaseConfig.apiKey);
console.log('authDomain:', firebaseConfig.authDomain);
console.log('projectId:', firebaseConfig.projectId);
console.log('storageBucket:', firebaseConfig.storageBucket);
console.log('messagingSenderId:', firebaseConfig.messagingSenderId);
console.log('appId:', firebaseConfig.appId);
console.log('\n + Validation Results:');

const checks = {
  apiKey: {
    valid: firebaseConfig.apiKey && 
           firebaseConfig.apiKey.startsWith('AIza') && 
           firebaseConfig.apiKey.length > 30,
    message: 'Must start with "AIza" and be ~39 characters'
  },
  authDomain: {
    valid: firebaseConfig.authDomain && 
           firebaseConfig.authDomain.includes('.firebaseapp.com'),
    message: 'Must end with ".firebaseapp.com"'
  },
  projectId: {
    valid: firebaseConfig.projectId && 
           firebaseConfig.projectId.length > 3,
    message: 'Must be your actual project ID'
  },
  storageBucket: {
    valid: firebaseConfig.storageBucket && 
           (firebaseConfig.storageBucket.includes('.appspot.com') ||
            firebaseConfig.storageBucket.includes('.firebasestorage.app')),
    message: 'Must end with ".appspot.com" or ".firebasestorage.app"'
  },
  messagingSenderId: {
    valid: firebaseConfig.messagingSenderId && 
           /^\d+$/.test(firebaseConfig.messagingSenderId) &&
           firebaseConfig.messagingSenderId.length > 5,
    message: 'Must be numbers only (10-12 digits)'
  },
  appId: {
    valid: firebaseConfig.appId && 
           firebaseConfig.appId.includes(':web:'),
    message: 'Must contain ":web:" (format: 1:xxx:web:xxx)'
  }
};

let allValid = true;

Object.entries(checks).forEach(([key, check]) => {
  const icon = check.valid ? '+' : '-';
  console.log(`${icon} ${key}: ${check.valid ? 'Valid' : 'INVALID - ' + check.message}`);
  if (!check.valid) allValid = false;
});

if (allValid) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('+ ALL CONFIGURATION VALID!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore
export const db = getFirestore(app);

console.log('++++ Firebase initialized successfully!\n');

export default app;