## Allen:
#### Role:
#### Contribution:
*1. Ideated and Initiated Project Theme*
- Proposed the project idea, which was selected as the foundation for the app development.

*2. Data Extraction and Cleaning*
- Analyzed the API call structure of Rate My Professor (RMP) and developed a web scraping script to retrieve all UCSB professor data.
- Cleaned and filtered the data, removing duplicates and erroneous entries for accuracy.

*3. Data Categorization and Storage*
- Reorganized professors into departments for efficient storage and retrieval in Firestore.
- Seeded the cleaned and categorized data into Firestore for seamless integration.

*4. Data Fetching Functionality*
- Built a `FetchProfessor` function that retrieves professor RMP data based on the course's department, professor's last name, and the initial of their first name.

*5. Department Mapping Solution*
- Created a `departmentMapping.json` to resolve discrepancies between GOLD API's department codes and the database's department names.
- Addressed inconsistencies between the course's department code and subject area for robust data mapping.

*6. UI Design and Integration for Course Details*
- Designed and implemented the UI for the Course Detail page to display instructors' RMP data, improving the user experience.

*7. Enhanced Professor Comments Accessibility*
- Scraped professors' comments from RMP using Selenium, leveraging their `legacyId` to generate direct page links.
- Integrated GPT-4 Mini API to summarize each professor's comments into concise 2-3 sentence overviews and updated Firestore with these summaries.

*8. UI Updates for Professor Comments*
- Enhanced the Course Detail UI to display summarized professor comments, providing additional insights for students.

*9. Search Component Enhancements*
- Resolved coverage gaps in the search component for courses and departments.
- Implemented dual API URL generation for searches by department code and subject area, accounting for distinct content in these fields.
- Developed a dedicated list `departmentList.json` for department-based searches to improve search reliability.

*10. Comprehensive Debugging and Optimization*
- Addressed issues in search functionality and ensured accurate results across different query types.
- Optimized the system for seamless user interactions and data retrieval processes.

## Daniel:
#### Role:  Backend, Database, Testing, Security
#### Contribution:
##### Security:
- Created a Firebase Cloud Functions hosting project that injects the UCSB API key as a passthrough to prevent decompiling the app for the API key
- Properly secured the Firebase Realtime Database and Firebase Cloud Functions by ensuring that only authorized users have access to their data, and only signed-in users can make use of the UCSB API
- Ensured all app requests pass through the Firebase Cloud Functions
- 
##### Backend:
*1. Course Register:*
- Created a central register for followed courses
- Set up firebase sync for followed courses
- Integrated use of AsyncStorage into the app for local storage of saved classes
-
*2. Notifications:*
- Set up a background task on both Android and iPhone to check if courses have available seats while in the user's pass time
- Set up notifications for each course when there is a seat available
- Stored previously sent notifications to a notification history

*3. Login Functionality:*
- Enabled login functionality for android by adding the app's fingerprints to the Firebase console

##### Miscellaneous:
*4. Follow All:*
- Enabled functionality of the follow all button by ensuring that it stays in sync with the course register and the buttons on the previous page

*5. Button Sync:*
- Tracked down errors in the follow buttons on the Home Screen Page
- Forced them to stay in sync with the course register for the rest of the app

*6. Data Synchronicity:*
- Ensured pages properly reload when navigated to to ensure that they correctly display the state of the courses

*7. Lecture detection:*
- Programmed the Search Component and Class components to properly detect labs, classes without sections, and sections so that display correctly and are followable as designed.

*8. Notifications Page:*
- Filled in the Notifications section of the app to properly display previously sent notifications and allow the user to delete them

*9. Expo CNG Generation:*
- Ensured the app was configured correctly to allow Expo to continuously generated the native code for both Android and iOS without having to require developer modification to either of the actual native apps.

## June:
#### Role: Frontend, Database, UI/UX coordinator, First Retro Leader
#### Contribution:
*1. Developed and Debugged Bottom Bar Navigation*
- Implemented a functional bottom bar with navigation capabilities.
- Debugged duplicate headers for a seamless user experience.
- Added a blur effect to enhance the visual appeal and usability of the bottom bar.
- 
*2. Designed Clean UI*
- Collaborated on a draft of a modern and user-friendly interface using Figma.

*3. Integrated Login Functionality*
- Implemented a secure Google login page that allows users to authenticate with their Google accounts.
- Ensured user information is stored in the database upon successful login.

*4. Built and Enhanced the Settings Screen*
- Developed a logout feature with a confirmation alert to prevent accidental logouts.
- Designed a customizable interface for users to update their major and specify their passtimes.
- Added a quick-access button for direct navigation to the "GOLD" page.
- Created a profile page displaying detailed information about team members.

*5. Improved Major Modification Accessibility*
- Added a button in the empty state, enabling users to navigate to the major change page and update their major effortlessly.

*6. Refined Cart and Notification UI*
- Standardized the UI design for the cart and notification features for a consistent appearance.
- Implemented swipe interactions to keep the interface clean and responsive.

*7. Enabled Easy Enrollment Code Access*
- Created a "Copy ID" button allowing users to directly retrieve the enrollment code for sections of interest.

*8. Enhanced Search and Filter Usability*
- Added a crocs button in the search bar to clear search input and a "Cancel Selection" option in the Major filter, enabling users to reset their course list to the default major view easily.

## Karsten:
#### Role: 
#### Contribution:

## Simon:
#### Role: UI/UX Design, Frontend
#### Contribution:
*1. Designed and Implemented the Header Bar*
- Created the fundamental Header.js component for the app.
- Incorporated a simple and functional design for the header bar to ensure it aligns with the overall app theme.

*2. Added Branding Elements to the Header*
- Integrated the app's logo into the header bar for consistent branding across all pages.
- Added the app's name next to the logo, ensuring proper visibility and readability.

*3. Incorporated User Profile Features*
- Added functionality to display the user's profile photo in the header.
- Ensured the profile photo dynamically updates based on the logged-in user's data.

*4. Enhanced Header Navigation*
- Helped modify the header bar to display the names of different pages dynamically.
- Designed the page name display to update seamlessly as users navigate between app sections.

*5. Header Bar Optimization*
- Collaborated with the team to make adjustments to the header design based on user feedback and testing.
- Helped improve the layout to maintain a balance between aesthetics and functionality.

*6. Header Implementation Assistance*
- Provided guidance on integrating the header bar with other app components.
- Assisted with troubleshooting and resolving bugs related to the header's responsiveness and functionality.

## Xinyao
### Role:
### Contributions:
1. Designed the app logo and assets, including all navigation images, icons, and the selection of new fonts.
2. Ensured consistency across all style sheets within the app including icons and color themes.
3. Refined the UI for the home page:
   - Fixed bugs relating to animated view within the home scroll.
   - Added an animated category flat list to search for both department and quarter.
   - Implemented the `Class` component rendering UI.
   - Added an animated view for the home component to ensure it moves with the header when the text search bar is hidden.
4. Developed and implemented four Jest unit and component tests.
5. Synchronized all app header bars and navigation logic to ensure pages are placed correctly within their respective stack navigations.
6. Adjusted the course detail page to align with the app's overall theme.
7. Fixed various visual bugs in the cart and home pages.
8. Designed the new login page after MVP.

