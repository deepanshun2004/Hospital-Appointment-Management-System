<<<<<<< HEAD
<<<<<<< HEAD
# Hospital Appointment Booking System

Monorepo containing a React frontend and Spring Boot microservices:
- doctor-service (CRUD doctors)
- patient-service (JWT auth: register/login)
- appointment-service (book/cancel appointments)
- api-gateway (Spring Cloud Gateway)

## Getting Started

1) Create MySQL databases (adjust credentials in each `application.yml`):
- doctor_service_db
- patient_service_db
- appointment_service_db

2) Backend (from each service directory):
```
mvn spring-boot:run
```

3) Frontend (from `frontend`):
```
npm install
npm run dev
```

## Services Ports
- api-gateway: 8080
- doctor-service: 8081
- patient-service: 8082
- appointment-service: 8083

## Example API
- POST /patients/register
- POST /patients/login
- GET /doctors
- POST /appointments/book
- POST /appointments/cancel
=======
# Hospital-Appointment-Management-System
>>>>>>> 36baa815f291ac4bd3cea4b66be79dbde4c18927
=======
# Hospital-Appointment-Management-System
>>>>>>> a19485d27b35085890df0ce35a5e5d0537888be3
