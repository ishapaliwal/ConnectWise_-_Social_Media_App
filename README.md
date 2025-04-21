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
