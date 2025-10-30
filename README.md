# 🏥 Hospital Appointment Management System

A **Microservices-based Web Application** to manage hospital appointments efficiently.  
Patients can register and book appointments, doctors can manage availability, and admins can oversee the entire system — all through a unified, secure platform.  

---

## ✨ Features

### 👩‍⚕️ Patient Management
- Patient registration & login  
- View & update profile  
- Manage personal appointments  

### 🧑‍⚕️ Doctor Management
- Doctor registration & login  
- Add specialization & schedule  
- Manage patient appointments  

### 📅 Appointment Management
- Search & filter doctors by specialization  
- Create, cancel, or reschedule appointments  
- View appointment history  

### 🛡️ Security & Gateway
- **JWT-based authentication** across services  
- **API Gateway** as a single entry point for all services  

### 💻 Frontend
- Built with **React**, **Vite**, and **TailwindCSS/Bootstrap** for a clean, responsive UI  

---

## 🧱 System Architecture

```mermaid
flowchart LR
    A[Frontend (React)] --> B[API Gateway]
    B --> C[Patient Service]
    B --> D[Doctor Service]
    B --> E[Appointment Service]
    C --- F[(Patient DB)]
    D --- G[(Doctor DB)]
    E --- H[(Appointment DB)]
