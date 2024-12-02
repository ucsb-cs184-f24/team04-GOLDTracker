import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
// import { firebaseConfig } from "../firebaseConfig.js";  // Adjust path as needed
import fs from "fs";  // Import the file system module to read the JSON file
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';

// Recreate __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// read the data in firebase
const querySnapshot = await getDocs(collection(db, "professors/art/profList"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});


// Load professor data from JSON file
const filePath = path.join(__dirname, "rmp_prof_with_summarized_comments.json"); // JSON file containing comments
const professorData = JSON.parse(fs.readFileSync(filePath, "utf8"));


// Function to update professors with comments
const updateDatabaseWithComments = async () => {
  try {
    for (const prof of professorData) {
      const comment = prof.comments_summarized_by_gpt
      const department = prof.department.toLowerCase(); 
      const legacyId =  Number(prof.legacyId);
      console.log(": ", department)

      // Log query path and parameters for debugging
      console.log(`Querying professors/${department}/profList where legacyId == ${legacyId}`);

      // Fetch the professor document using `legacyId`
      const profCollection = collection(db, `professors/${department}/profList`);
      const querySnapshot = await getDocs(query(profCollection, where("legacyId", "==", legacyId)));

      if (querySnapshot.empty) {
        console.log(`No professor found with legacyId: ${legacyId}`);
        continue;
      }

      querySnapshot.forEach(async (doc) => {
        // Update the document with the new comments entry
        await updateDoc(doc.ref, {
          comments_summarized_by_gpt: comment
        });
        console.log(`Updated professor with legacyId ${legacyId} with comments.`);
      });
    }
    console.log("Database update completed.");
  } catch (error) {
    console.error("Error updating database:", error);
  }
};

// Run the update function
updateDatabaseWithComments().then(() => process.exit());
