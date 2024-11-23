# Implementation

### **New Functionality Features**
1. **Customized User Preferences:**
   - Enabled users to choose their major from a provided list.
   - Allowed users to specify their pass times using date and time pickers.
   - Displayed the list of major-specific courses on the Home Screen after preferences were saved.

2. **Backend Support:**
   - Forced users to log in using their UCSB email addresses. Login attempts with non-`@ucsb.edu` emails are rejected.
   - Stored user information (e.g., major and pass times) in the Firestore database.

### **UI Components**
1. **Logout Confirmation Alert:**
   - Added a confirmation alert when users click the logout button. If the user selects "Yes," they are redirected to the login page; otherwise, the app retains the logged-in status.

2. **Navigation Enhancements:**
   - Added a "Preference" button in the More screen to allow users to access the preference page.
   - Introduced a button on the Home Screen that directs users to the preference page if their major is not set during their first login.

---
### **What new user stories added after my implementation**
- Users logging in with non-`@ucsb.edu` emails remain on the login page.
- A confirmation alert is shown when the logout button is clicked.
- A "Preference" button appears in the More screen.
- Users see a button on the Home Screen linking to the preference page when their major is not set.
- Users can edit their major and pass times on the preference page and save the information.
- An alert confirms the successful saving of preferences.
- After saving, the Home Screen shows a list of major-specific courses.
- Users’ customized preferences are stored in Firestore and persist across app sessions.

---

## **Key Ingredients and Tools**

The implementation relies on the following libraries and tools:
- **Pickers:**
  - [`@react-native-picker/picker`](https://github.com/react-native-picker/picker) for dropdown selection of majors.
  - [`@react-native-community/datetimepicker`](https://github.com/react-native-datetimepicker/datetimepicker) for date and time inputs.
- **Firebase Firestore:**
  - Functions like `doc`, `getDoc`, `updateDoc`, and `setDoc` for managing user data in Firestore.
- **React Native Navigation:**
  - Added navigation to link new components (e.g., preference page) with existing screens.
- **Alerts:**
  - Implemented `Alert` components to enhance user interactions, such as logout confirmation and data-saving notifications.

---

## **Results**
### **After My Contribution:**
- **Login Flow:** Only users with `@ucsb.edu` email addresses can log in successfully. User data is stored in Firestore for later use.
- **Home Screen Updates:** Users without a saved major see a button to set preferences. After saving, the Home Screen displays major-specific courses.
- **Preference Page:** Users can:
  - Edit their major and pass times.
  - Save data with confirmation alerts.
  - See their updated preferences when revisiting the page.

---

## **Folder Structure**
The code for my contributions is located in the following folder:
- [GitHub Folder URL](https://github.com/ucsb-cs184-f24/team04-GOLDTracker/tree/main/team/zhenbi93)

This folder includes:
1. **Source Files:** The implementation of the features described above.
2. **README.md:** Explanation of the structure and contribution details.
3. **HW04 Folder:** Starting point for evaluating my work, located under `team/<your_github_handle>/`.

--- 

Thank you for reviewing my contribution! Please feel free to reach out with any questions.
