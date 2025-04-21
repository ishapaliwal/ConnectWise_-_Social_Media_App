# ConnectWise

A full-featured **social media platform** built with **React, Node.js, PostgreSQL**, and **AWS S3**, offering users a vibrant space to connect, share posts, chat, and manage content.

---

## 🌐 Live Demo
🔗 [https://connectwise.netlify.app](https://connectwise.netlify.app)

> **Sample Credentials:**  
> Email: `isha.paliwal@gwu.wdu`  
> Password: `User@1234.Right`

---

## 🌟 Features

### 👤 User Profile
- View and edit your profile
- Upload avatar images (stored in AWS S3)

### 📝 Create & Explore Posts
- Create posts with text and optional images
- Responsive image grid view (Explore page)
- View posts in detail via shareable links

### ❤️ Like & Comment
- Like/unlike posts
- View users who liked a post
- Comment and view threaded discussions

### 🔄 Real-Time Messaging
- One-on-one chats with other users
- Live message updates (polling)
- Send links, text, and post previews

### 📢 Notifications
- Receive notifications for likes, comments, and messages
- Mark as read, clear all

### 🛡️ Admin Panel
- Moderate flagged posts, users, comments
- Approve/delete/ban content

### 📤 Sharing Posts
- Share any post via in-app chat
- Generates link and preview

### 🔍 Search Users
- Autocomplete dropdown for users
- Navigate to other profiles

---

## 🛠️ Tech Stack

| Frontend       | Backend        | Database  | Cloud     |
|----------------|----------------|-----------|-----------|
| React + MUI    | Node.js + Express | PostgreSQL | AWS S3    |
| Redux Toolkit  | JWT Auth       | pgAdmin   | Railway / Local |

---

## 📁 Folder Structure

```
├── frontend
│   ├── components
│   ├── pages
│   ├── features (Redux)
│   └── services
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   └── middleware
```

---

## 🖼️ Screenshots

### 👤 Profile Page (Website view)
![Profile_Website](https://github.com/user-attachments/assets/d12c7ff7-c1e0-41c9-8ee5-5ec14f8f4b24)

### 👤 Profile Page (Mobile view)
![Profile_Mobile](https://github.com/user-attachments/assets/be399629-1d91-4b6f-9792-d74cc9c0ab0b)

### 🧭 Explore Page
![Explore](https://github.com/user-attachments/assets/9da3123f-c948-4676-b7a7-84a908d07962)

### 💬 Messaging (Post Sharing & Preview)
![Messaging](https://github.com/user-attachments/assets/53691b0c-924b-4abe-b62a-582cf65cbfee)

### 👤 Admin Panel
![Admin_Panel](https://github.com/user-attachments/assets/29afde67-7412-4280-aa7b-3ea8e122b1bb)

### 📤 Notifications
![Notifications](https://github.com/user-attachments/assets/048ae0ab-5ee6-45bb-951c-d91627f351c9)


---

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
