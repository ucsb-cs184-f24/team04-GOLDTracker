# GOLDTracker Design Document

**Team members:**   
#### Simranjit Mann, Daniel Jesen, Xinyao Song, Karsten Lansing, June Bi, Allen Hu  
---

## Introduction 
---
- ### Background

University course registration is a crucial and an often stressful period for students, characterized by the rush to secure spots in desired classes. At UCSB, navigating GOLD to find relevant course information, monitor class availability, and quickly enroll in open sections is difficult. While the current process involves frequent manual checks for open spots and navigating a complex interface, it can be time-consuming and challenging. To address these challenges, we developed GOLDTracker, a solution specifically tailored for the UCSB student community. The app offers a streamlined, user-friendly platform that enables students to search for courses, view detailed information, save preferred classes to a personalized cart, see rate-my-professor statistics, and receive real-time notifications when spots become available or when the class becomes full. Users can log in using their UCSB email credentials, ensuring that the platform remains exclusive to the university community. This functionality reduces the time and effort needed during the registration process, helping students secure their preferred classes more efficiently. Looking ahead, potential expansions include integrating calendar features for better schedule planning and introducing user-generated reviews and ratings for professors and courses. Our goal is to enhance the course registration experience for UCSB students, offering them a reliable tool to manage their academic schedules with greater ease and efficiency.

- ### Requirements

Our mobile application is developed using React Native and Expo Go for its cross-platform compatibility, providing a consistent experience across iOS and Android devices. Firebase is utilized as the backend service for user authentication and database storage. The key features of the app include:

* **User Authentication:** Secure login via UCSB email accounts using Firebase Authentication, ensuring the platform is exclusive to UCSB students.  
* **Course Search:** A robust search function that allows users to find courses by subject, course level, or professor, with filters to sort by professor ratings and availability.  
* **Course Cart:** A personalized cart where students can save courses they are interested in and monitor their availability in real time.  
* **Notifications:** Instant alerts when a course in the user's cart has open seats, enabling students to act quickly during registration periods.

These requirements are designed to address common pain points faced by UCSB students during course registration, improving both efficiency and user experience.

## Overview
---
- **Status:** Development in Progress

- **Team Members:**  
  - **Daniel Jesen** (Backend, Database, Testing)  
  - **Xinyao Song** (Frontend, Backend, Database, Testing)  
  - **Karsten Lansing** (Frontend, Backend)  
  - **June Bi** (Frontend, Design)  
  - **Allen Hu** (Frontend, Backend, Database)  
  - **Simranjit Mann** (Frontend)

- #### **Team Key Decisions**

1. **Frontend-Backend Frameworks**:  
   * Chose React Native for its cross-platform compatibility.  
   * Selected Firebase for its free database and ease of integration.  
2. **User Authentication**:  
   * Decided on UCSB email-based login.  
3.  **Extra Features**  
   * Decided into integrate rate-my-professor data

## Design
---
- ### System Architecture Overview

![background](https://github.com/user-attachments/assets/69ff5025-afa7-4810-b018-cda6ceda07a6)

- ### **System Components**

  1. **Frontend (React Native)**  
  - Implements the user interface for searching courses, managing the cart, and receiving notifications.  
  - Built using React Native for cross-platform support.  
  - Integrates with Firebase for real-time data updates and authentication.  
  2. **Backend**   
  - Manages user data, handles authentication, and provides real-time notifications when a course has available spots.  
  - Interfaces with the UCSB GOLD API to fetch and update course information.
  - Integrated with the OpenAI API for summary the comments of professors from RateMyProfessor
  - Pythons the data from the RateMyProfessor and saved all of professors scores in the database.
    
- ### **User experience**
  1. After users clear the search input, we will not show the empty screen but always shows the course list of users' major.
  2. Notifications will show detailed information to show which specific
  3. In many places, such as the unfollow button in the cart screen and the log out button, we implemented alerts to avoid prevent accidental actions.

## **Task/User Flow**
---
1. **Login Flow**  
   * User logs in via UCSB email.  
   * Authentication validated through Firebase.  
2. **Course Search Flow**  
   * User searches for courses by department or course ID 
3. **Cart and Notification Flow**  
   * User adds courses to their cart.  
   * Receives notifications when availability changes.
   course has spare spaces.
4. **Course Details Flow**  
   * User views detailed course information, including professor ratings.  
   * Makes informed registration decisions.
