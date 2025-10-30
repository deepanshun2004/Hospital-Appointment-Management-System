<h1 align="center">🏥 Hospital Appointment Management System</h1>

![App Demo](/frontend/public/screenshot-for-readme.png)

---

### 🌟 Highlights

- 👩‍⚕️ Patient Registration, Login & Appointment Booking  
- 🧑‍⚕️ Doctor Dashboard with Availability & Schedule Management  
- 📅 Appointment Creation, Rescheduling & Cancellation  
- 🔐 Secure JWT Authentication across all services  
- 🚪 API Gateway as a Single Entry Point  
- 💻 Responsive UI using React + Vite + TailwindCSS  
- ⚙️ Microservices Architecture (Patient, Doctor, Appointment)  
- 🗄️ Separate Databases per Service for Scalability  
- 🐳 Docker & Kubernetes Ready (Optional Deployment)  
- 🚀 Designed for Performance and Maintainability  

---

## 🧱 System Architecture

Frontend (React)
|
v
API Gateway
/ |
/ |
Patient Doctor Appointment
Service Service Service
| | |
PatientDB DoctorDB AppointmentDB

yaml
Copy code

---

## ⚙️ Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| Frontend | React, Vite, TailwindCSS |
| Backend | Node.js, Express.js |
| Authentication | JWT |
| Database | MongoDB / MySQL |
| Gateway | Nginx / API Gateway |
| Deployment | Docker / Kubernetes (optional) |

---

## 🧪 `.env` Setup

### Backend (`/backend`)
PORT=5001
MONGO_URI=your_mongo_uri
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development

shell
Copy code

### Frontend (`/frontend`)
VITE_API_BASE_URL=http://localhost:5001

yaml
Copy code

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
💻 Run the Frontend
bash
Copy code
cd frontend
npm install
npm run dev
🧩 Microservices Overview
🩺 Patient Service – Registration, login, and personal data

👨‍⚕️ Doctor Service – Manage profiles, specializations & appointments

📅 Appointment Service – Book, update, or cancel appointments

🚪 API Gateway – Handles routing & authentication across services

🧑‍💻 Contributors
Name	Role
Your Name	Full Stack Developer
Team Member 1	Backend Engineer
Team Member 2	UI/UX Designer

📄 License
This project is licensed under the MIT License.
Feel free to use and modify it for learning or production.

❤️ Acknowledgements
Special thanks to:

Open Source Libraries (React, Express, MongoDB)

TailwindCSS for styling

The developer community for continuous support

