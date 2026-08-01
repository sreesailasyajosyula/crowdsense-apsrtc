import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Public client config — safe to expose in frontend code.
const firebaseConfig = {
  apiKey: 'AIzaSyB0pRYw75nPV05tbMLM5EdAv59Bk7Wfuf0',
  authDomain: 'crowdsense-apsrtc.firebaseapp.com',
  projectId: 'crowdsense-apsrtc',
  storageBucket: 'crowdsense-apsrtc.firebasestorage.app',
  messagingSenderId: '452840639360',
  appId: '1:452840639360:web:c389c4d025f1ff9a564f65',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
