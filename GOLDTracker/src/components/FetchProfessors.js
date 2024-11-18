import { getDocs, collection, doc, query } from "firebase/firestore";
import { firestore } from "../../firebaseConfig.js";  
import departmentMapping from "../assets/departmentMapping.json" with { type: "json" }; 

const db = firestore

// read the data in firebase
export async function FetchProfessorsByDepartment(departmentCode, courseInstructor) {
  const professors = [];
  console.log("start to find professor's rmp")
  // Get possible department names for the given code from the imported JSON
  const departmentNames = departmentMapping[departmentCode] || [];
  console.log('departmentName mapped: ', departmentNames[0])
  try {
    for (const deptName of departmentNames) {
      const q = query(collection(db, `professors/${deptName}/profList`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        professors.push({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          avgRating: data.avgRating,
          avgDifficulty: data.avgDifficulty,
          numRatings: data.numRatings,
          wouldTakeAgainPercent: data.wouldTakeAgainPercent,
        });
      });
    }

    // Match the course professor 
    const matchedProfessor = professors.find((prof) => {
      const parts = courseInstructor.split(" ");
      
      // Ensure parts have the expected structure
      if (parts.length < 2) {
        console.warn("courseInstructor is missing required parts:", courseInstructor);
        return false; 
      }
      
      const [lastName, firstInitialWithDot] = parts;
      const firstInitial = firstInitialWithDot.replace(".", ""); // Remove period
    
      return (
        prof.lastName.toLowerCase() === lastName.toLowerCase() &&
        prof.firstName[0].toLowerCase() === firstInitial.toLowerCase()
      );
    });

    return matchedProfessor ? [matchedProfessor] : [];
  } catch (error) {
    console.error("Error fetching professors:", error);
    return [];
  }
}