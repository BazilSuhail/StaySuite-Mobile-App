## StaySuite
**StaySuite** is a property rental platform similar offering key features such as user authentication, booking management, saving travelling history and favurite listings for guests while enabling  host to manange listings via dashboard and seamlessly handle  reservations made on there listings. It supports secure authentication using `JWT`, real-time updates for both guests and hosts with `Socket.io`, and image uploads of listings with `Multer`. Built with `Nuxt.js` for the frontend,` Nest.js `for the backend, and `MongoDB` for data storage, the platform ensures a seamless and efficient user experience.

</br>

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](#)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat&label=Contributions&colorA=red&colorB=black	)](#)

## Project Description:
This mobile app, built with React Native, Nest.js, and MongoDB, enables users to securely authenticate, manage bookings, and view reservation history. It includes a robust filtering system for property search, along with the ability to leave ratings and reviews on listings. Users can also save their favorite properties for easy access. The backend ensures smooth data handling while the app delivers an intuitive, user-friendly experience. Designed as a complete property rental platform, it covers key functionalities essential for both users and property managers.

### 🤖 Tech Stack 
<a href="#"> 
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?&style=for-the-badge&logo=javascript&logoColor=black"/>
<img alt="React Native" src="https://img.shields.io/badge/React%20Native-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
<img alt="Node js" src="https://img.shields.io/badge/Node.js-%23339933.svg?&style=for-the-badge&logo=node.js&logoColor=white"/> 
<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/>
<img alt="Express js" src="https://img.shields.io/badge/Express.js-%23000000.svg?&style=for-the-badge&logo=express&logoColor=white"/>   
<img alt="React Native Reanimated" src="https://img.shields.io/badge/React%20Native%20Reanimated-%23845EC2.svg?&style=for-the-badge&logo=react&logoColor=%23FFFFFF"/>

<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-%232F73B4.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/>

<img alt="Nest.js" src="https://img.shields.io/badge/Nest.js-%23E0234E.svg?&style=for-the-badge&logo=NestJS&logoColor=white"/>

<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/> 
 <img alt="JWT Auth" src="https://img.shields.io/badge/JWT%20Auth-%23F7B731.svg?&style=for-the-badge&logo=json-web-tokens&logoColor=white"/>

<img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO%20-%23010101.svg?&style=for-the-badge&logo=socket.io&logoColor=white"/>
 </a>
 
#### Check out the latest demo of Project [StaySuite Mobile App](https://entitysafe.netlify.app/pages/AppList/-OK5pvN59J-pvjtbQXGo-O4swNr4Vi3X0OLPoTQy). 

![App Screenshot](https://github.com/BazilSuhail/BazilSuhail/blob/main/stay-suite-cover.png)


---
- Check out the latest demo of Web-Based Application Project [stay-suite.vercel.app](https://collabora8r.vercel.app/). 
- Find the Client Repository of this Project's Web-based Applicaiton Here [StaySuite-Server](https://github.com/BazilSuhail/StaySuite-Client). 
- Find the Server Repository of this Project Here [StaySuite-Server](https://github.com/BazilSuhail/StaySuite-Server). 
---

### Run Locally
Clone the project using the following command:
```bash
   git clone https://github.com/BazilSuhail/StaySuite-Mobile-App.git
```
Go to the project directory
```bash
   cd StaySuite-Mobile-App
```
Then **Run** this command in your terminal to install all required dependancies:
```bash
   npm install
```
In the project directory, you can run:
```bash
    npm expo start -c
``` 


Install **Expo GO** from playstore after scanning the QR code given interminal start the app.
Another option is to get Android Studio Installed and type **a** in terminal to open the app in android studio itself

---

## Features

#### User Authentication
- **Signup Page**: A registration form for new users.
- **Login Page**: A login form for existing users.
 
#### Protected Screens
- **User Profile**: User can only view his information . 
- **Booking history**: Guests can view there booking history.
- **Redirection for Unauthenticated Users**: Users attempting to access protected screens are redirected to the login page.

#### State Management and Security
- **JWT Storage**: JWT tokens are stored in `localStorage` for user session management.
- **API Interception**: Used Axios interceptors or middleware to attach tokens to API requests.
- **Frontend State Management**: Managed with `useState`, `useEffect` and `React Context`.

#### Booking System
- **Booking Screen**: Users can submit bookings, which are saved to the backend.
- **Reserved Bookings Screen**: Displays reserved bookings for each user.
- **Reservatiosn History/ Bookings History Screen**: Displays reserved bookings hisotyr or made reservations for each user he/ she has made.
- **Reserved Bookings for Host Page**: Displays reserved bookings on Hosts Listings.

#### Backend Security
- **Role-Based Access Control**: Routes are protected based on user roles (e.g., admin).
- **JWT Middleware**: Secures routes that require authentication.
- **Password Hashing**: Passwords are hashed using bcrypt before being saved to the database.
 
#### Styling and UX
- Consistent design with **Nativewind** and Tailwind CSS. 
- React-native-reanimated to deliver smoother animation experinces.
- 2d illustrations to provide an engaing user experience.


---

### Web-Based Application's Information 

##### Frontend
- **Nuxt.js**: Server-side rendering and seamless routing.
- **Pinia Store**: Centralized state management.
- **VueUse Motion**: Animations and transitions.
- **Tailwind CSS**: Styling and responsive design.
- **Socket.io**: Real-time updates for bookings and reservations.

##### Backend
- **Nest.js**: Robust and scalable backend framework.
- **MongoDB**: Database for storing listings, bookings, and user data.
- **Multer**: Handling image uploads for listings.
- **JWT**: Secure authentication and session management.
- **Bcrypt**: Password hashing for enhanced security.
