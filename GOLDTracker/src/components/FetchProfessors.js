import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query } from "firebase/firestore";
// import { firebaseConfig } from "../firebaseConfig.js";  // Adjust path as needed
import fs from "fs";  // Import the file system module to read the JSON file
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import departmentMapping from "../assets/departmentMapping.json" assert { type: "json" }; 

// Recreate __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLIQJtYBYpxGTVMt_W_Hw_0yoKghXxAmw",
  authDomain: "goldtracker-beb96.firebaseapp.com",
  projectId: "goldtracker-beb96",
  storageBucket: "goldtracker-beb96.appspot.com",
  messagingSenderId: "756708191969",
  appId: "1:756708191969:web:347221cec45ce7054c91a0",
  measurementId: "G-XGXC2HCFZ2",
};
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// read the data in firebase
export async function fetchProfessorsByDepartment(departmentCode) {
  const professors = [];

  // Get possible department names for the given code from the imported JSON
  const departmentNames = departmentMapping[departmentCode] || [];

  try {
      // Query Firestore for each department name
      for (const name of departmentNames) {
        console.log("department name: ", name)
          const q = query(collection(db, `professors/${name}/profList`));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
              professors.push({ id: doc.id, ...doc.data() });
          });
      }
  } catch (error) {
      console.error("Error fetching professors:", error);
  }
  return professors;
}