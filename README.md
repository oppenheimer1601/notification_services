Here’s a complete `README.md` for your **Notification Service** project, including setup without Docker, with support for **Email**, **SMS**, and **In-App** notifications using **RabbitMQ**, **MongoDB**, **Nodemailer**, and **Twilio**:

---


# 📬 Notification Service

A simple notification service built with Node.js that supports:

- 📧 Email Notifications (via Nodemailer)
- 📱 SMS Notifications (via Twilio)
- 🖥️ In-App Notifications (stored and retrieved via API)

The system uses **MongoDB** to store notifications and users, and **RabbitMQ** to queue and process notification delivery asynchronously.



## 📁 Project Structure

```
project-root/
├── models/
│   ├── notification.js
│   └── user.js
├── worker/
│   └── consumer.js
├── .env
├── app.js
├── package.json
```
---

## ✅ Prerequisites

- Node.js (v14+ recommended)
- MongoDB installed and running locally
- RabbitMQ installed and running locally (with management UI enabled)
- Nodemailer-compatible email account (e.g. Gmail)
- Twilio account (optional for SMS)

---

## ⚙️ Environment Setup

1. Clone the repository:

```bash
git clone <repo_url>
cd <project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` in the project root:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_TWILIO_PHONE_number
```

> ⚠️ For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833) instead of your main password.

---

## 🧠 Start Required Services (Without Docker)

### 🟢 MongoDB

#### 
    run and install it locally
---

### 🟢 RabbitMQ

    run and install it locally
## 🚀 Run the Application

### 1️⃣ Start the API Server

```bash
npm start
```

Server runs at: `http://localhost:3000`

### 2️⃣ Start the Worker (Consumer)

In another terminal:

```bash
npm run worker
```

This worker listens to the RabbitMQ queue and processes notifications.

---

## 📬 API Endpoints

### ➕ Create Notification

```http
POST /api/notifications
Content-Type: application/json
```

```json
{
  "userId": "MongoDB_User_ObjectId",
  "type": "email" | "sms" | "in-app",
  "message": "Your message here"
}
```

### 📥 Get User Notifications

```http
GET /api/users/:userId/notifications
```

Returns all notifications for the user, including status (`pending`, `sent`, `failed`).

---

## ✅ Example Usage

1. Insert a user in MongoDB:
   ```json
   {
     "name": "Alice",
     "email": "alice@example.com",
     "phone": "+1234567890"
   }
   ```

2. Send notification:
   ```json
   {
     "userId": "mongodb_generated_user_id",
     "type": "email",
     "message": "Welcome 

## 🏆 Features

- Asynchronous processing using RabbitMQ
- Retry mechanism for failed deliveries (max 3 tries)
- Email (Nodemailer), SMS (Twilio), and In-App support
- Easily extendable for web frontend with in-app notifications

---






