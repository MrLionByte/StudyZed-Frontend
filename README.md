
# StudyZed — Frontend

### 🚀 Built with React (Vite + Redux + Tailwind CSS)  
🔗 **Backend Repository:** [StudyZed Backend (Django Microservices)](https://github.com/MrLionByte/StudyZed-Backend)

---

## Overview  

**StudyZed** is a personalized, modular education platform aimed at empowering tutors and engaging students through modern digital tools. This repository hosts the **frontend application**, developed using **React.js (Vite)** and styled with **Tailwind CSS**, interfacing with the backend microservices via RESTful APIs.

The frontend offers an easy-to-use interface for students, tutors, and admins, enabling daily task management,assessment and analysis, in-app messaging, real-time collaboration, video sessions, notifications and more.

## ✨ Core Features

- **Daily Task & Assessment Tracking** – Assign and evaluate daily activities.  
- **Performance Analysis** – Visual insights into student progress.  
- **Leaderboard System** – Competitive elements to boost motivation.  
- **In-App Messaging** – Real-time chat using WebSockets.  
- **Live Video Sessions** – One-on-one and group calls via WebRTC/ZegoCloud.  
- **Firebase Push Notifications** – Stay informed with real-time alerts.  
- **Session Scheduling** – Book and manage live classes.  
- **Resource Sharing** – Upload and distribute notes, videos, and study materials.  
- **Custom Dashboards** – Personalized views for different user roles.  
- **Role-Based Login** – Secure access for tutors, students, and admins.  
- **ZedBot AI Assistant** – Smart in-app assistant .  
- **Tutor Payments** – Pay-per-session integration (Stripe, via backend).

--- 

## 🛠️ Tech Stack  
- **Frontend:** Vite + React.js
- **State Management:** Redux Toolkit  
- **Real-Time Features:** Firebase Cloud Messaging (FCM), WebSockets  
- **Video Call Integration:** WebRTC / ZegoCloud  
- **Backend Communication:** Axios (REST API)  

## 🛠️ Tech Stack

| Category            | Stack                                      |
|---------------------|--------------------------------------------|
| Frontend Framework  | Vite + React.js                            |
| Styling             | Tailwind CSS                               |
| State Management    | Redux Toolkit                              |
| Realtime Features   | Firebase Cloud Messaging, WebSockets       |
| Video Call          | ZegoCloud                                  |
| API Communication   | Axios (REST API)                           |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository  
```bash
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

## 📬 Contact
For feature requests, contributions, or questions, feel free to connect via [LinkedIn)](https://www.linkedin.com/in/farhan-mahmood-n/) or open an issue on the repository.
