// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 從 firebase/firestore 引入 "資料庫" 的工具
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDscUBkvZzaiFO6TXbOZ4JGSCTqhT7PeEk",
  authDomain: "vue-test-304bb.firebaseapp.com",
  projectId: "vue-test-304bb",
  storageBucket: "vue-test-304bb.firebasestorage.app",
  messagingSenderId: "168557869167",
  appId: "1:168557869167:web:d0f89b9379403d218df59a",
  measurementId: "G-SHR35NVSRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export {db};