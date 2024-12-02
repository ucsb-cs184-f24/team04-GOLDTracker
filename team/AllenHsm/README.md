# UI/Design Contributions

In Homework 4, I created a new component displaying the instructor's RateMyProfessor data on the **`CourseDetailScreen`** page

Here are the specific changes that merged to main: [pull request](https://github.com/ucsb-cs184-f24/team04-GOLDTracker/pull/74)

## Changed Files
1. **`GOLDTracker/src/components/FetchProfessors.js`**  
   From the message returned from GOLD API, it first maps the `departmentCode` of the course with the department names stored in Firestore. Then it fetches all professors in the mapped departments. After that, it splits the `courseInstructor` from GOLD into first name and last name and search them in the fetched data. Return the matched data. 

2. **`GOLDTracker/src/screen/CourseDetailScreen.js`**  
   `CourseDetailScreen` first call `FetchProfessors.js`  to get the current course's instructor's rmp data and then display the data as a component on the page. The color of `rating`, ` difficulty`, and `would take again` changes based on the value. 

3. **`GOLDTracker/src/assets/departmentMapping.json`**  
   `departmentMapping.json` stores each department code's corresponding departments in database. The mapping relation enables the  `FetchProfessors` to only fetch a few or one department to find the professor's RateMyProfessor data. 

## Notes
- There are emojis used in the RateMyProfessor component, which seems to be inconsistent with the overall style of the app for now. However, we are planning to make the UI style more "fancy" so we decide to keep these emojis. 
- Since the backend for user customize page is not completed, I did not start to build up the UI of the customize page. 
- I spent a lot of time on debugging the `FetchProfessor` because the data returned from GOLD can be confusing. For example. departments like `C LIT`, `BL ST`, `CH ST` has a space within them on gold. But the returned department code from GOLD API does not contain a space. Moreover, for `BL ST`, the returned department code is even not `BLST`, but `BLKST`. So I have to manuallly  check the returned code from GOLD API to make sure that I can actually match them with the corresponding departments in database. 
