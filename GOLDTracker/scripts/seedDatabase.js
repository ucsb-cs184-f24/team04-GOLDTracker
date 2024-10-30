import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
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
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});

// Load professor data from JSON file
const filePath = path.join(__dirname, "sorted_professors_flat.json");
const professorData = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Function to seed the database
const seedDatabase = async () => {
  try {
    for (const prof of professorData) {
      const department = prof.department.toLowerCase();  // Convert to lowercase for consistency
      const formattedProfessor = {
        avgDifficulty: Number(prof.avgDifficulty),
        avgRating: Number(prof.avgRating),
        firstName: String(prof.firstName),
        id: String(prof.id),
        lastName: String(prof.lastName),
        legacyId: Number(prof.legacyId),
        numRatings: Number(prof.numRatings),
        wouldTakeAgainPercent: Number(prof.wouldTakeAgainPercent),
      };

      console.log('Adding professor:', formattedProfessor);
      // Add each professor under the appropriate department's profList sub-collection
      const docRef = await addDoc(collection(db, `professors/${department}/profList`), formattedProfessor);
      console.log("Document written with ID:", docRef.id);
      console.log(`Added ${prof.firstName} ${prof.lastName} to ${department}`);
    }
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Run the seeding function
seedDatabase().then(() => process.exit());
