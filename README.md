
# Study-Zed 
### Frontend => Build Using React
### Backend <a href="git" >GIT</a>

## Overview  

Studyzed is an innovative study management platform designed to help tutors and students organize their academic life effectively. The platform combines task management, scheduling, assessment creation,tracking and resource organization tools to create a comprehensive study environment.This repository contains the **frontend** of StudyZed, built with **React.js**, communicating seamlessly with the backend services.

## Features  
- **Progress Tracking** – View study progress and insights.
- **Leaderboard** – Engage in a competitive learning environment.  
- **Real-time Notifications** – Get instant updates via Firebase Cloud Messaging (FCM).  
- **Messaging System** – Send and receive messages in real time using websocket.
- **One-on-One Video Calls** – Integrated for student and tutor interaction.  

## 🛠️ Tech Stack  
- **Frontend:** Vite-React.js, Tailwind CSS  
- **State Management:** Redux Toolkit  
- **Real-Time Features:** Firebase Cloud Messaging (FCM), WebSockets  
- **Video Call Integration:** WebRTC / ZegoCloud  
- **Backend Communication:** Axios (REST API)  


## 🏗️ Installation & Setup  

### **1. Clone the Repository**  
```sh
git clone https://github.com/MrLionByte/Frontend---StudyZed.git
cd Frontend---StudyZed
```
### **2. Install Dependencies**
```sh
npm install
```
### **3.Set Up Environment Variables**
```sh
VITE_API_URL=https://your-backend-api-url.com
VITE_APP_NAME=StudyZed
VITE_VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_KEY=your-api-key
VITE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-app-id.appspot.com
VITE_MESSAGING_SENDER_ID=your-sender-id
VITE_APP_ID=your-app-id.firebaseapp.com
VITE_MEASUREMENT_ID=your-measurement-id
VITE_VAPID_KEY=your-vapid-key

```
### **4.Run the Development Server**
```sh
npm run dev
```