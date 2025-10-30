package com.hospital.appointment.service;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.repository.AppointmentRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    // Basic book (kept for compatibility, but validateAndBook is preferred)
    public Optional<Appointment> book(Appointment a) {
        return Optional.ofNullable(a)
            .filter(appointment -> appointment.getDoctorId() != null)
            .filter(appointment -> appointment.getPatientId() != null)
            .map(appointment -> {
                appointment.setStatus("BOOKED");
                return repository.save(appointment);
            });
    }

    // Cancel -> mark as CANCELLED
    public boolean cancel(Long id) {
        return repository.findById(id)
            .map(appointment -> {
                appointment.setStatus("CANCELLED");
                repository.save(appointment);
                return true;
            })
            .orElse(false);
    }

    // Appointments for a patient
    public List<Appointment> forPatient(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    // === Functional examples retained ===

    public List<Appointment> findActiveAppointments() {
        return repository.findAll().stream()
            .filter(appointment -> !"CANCELLED".equals(appointment.getStatus()))
            .collect(Collectors.toList());
    }

    public List<Appointment> findAppointmentsBy(Predicate<Appointment> condition) {
        return repository.findAll().stream()
            .filter(condition)
            .collect(Collectors.toList());
    }

    public Map<String, List<Appointment>> groupByStatus() {
        return repository.findAll().stream()
            .collect(Collectors.groupingBy(Appointment::getStatus));
    }

    public List<Appointment> findTodaysAppointments() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return repository.findAll().stream()
            .filter(appointment -> today.equals(appointment.getDate()))
            .filter(appointment -> "BOOKED".equals(appointment.getStatus()))
            .sorted(Comparator.comparing(Appointment::getTimeSlot))
            .collect(Collectors.toList());
    }

    public Optional<Appointment> findLatestAppointmentForPatient(Long patientId) {
        return repository.findByPatientId(patientId).stream()
            .filter(appointment -> "BOOKED".equals(appointment.getStatus()))
            .max(Comparator.comparing(Appointment::getDate));
    }

    public long countAppointmentsByStatus(String status) {
        return repository.findAll().stream()
            .filter(appointment -> status.equals(appointment.getStatus()))
            .count();
    }

    public List<Appointment> findConflictingAppointments(Long doctorId, String date, String timeSlot) {
        return repository.findAll().stream()
            .filter(appointment -> doctorId.equals(appointment.getDoctorId()))
            .filter(appointment -> date.equals(appointment.getDate()))
            .filter(appointment -> timeSlot.equals(appointment.getTimeSlot()))
            .filter(appointment -> "BOOKED".equals(appointment.getStatus()))
            .collect(Collectors.toList());
    }

    public Optional<String> getAppointmentSummary(Long appointmentId) {
        return repository.findById(appointmentId)
            .filter(appointment -> "BOOKED".equals(appointment.getStatus()))
            .map(appointment -> String.format(
                "Appointment #%d: Doctor %d with Patient %d on %s at %s",
                appointment.getId(),
                appointment.getDoctorId(),
                appointment.getPatientId(),
                appointment.getDate(),
                appointment.getTimeSlot()
            ));
    }

    public Map<Long, Long> getDoctorAppointmentCounts() {
        return repository.findAll().stream()
            .filter(appointment -> "BOOKED".equals(appointment.getStatus()))
            .collect(Collectors.groupingBy(
                Appointment::getDoctorId,
                Collectors.counting()
            ));
    }

    // Validate if the appointment time is in the future
    private boolean isValidAppointmentTime(String date, String timeSlot) {
        try {
            LocalDate appointmentDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
            LocalTime appointmentTime = LocalTime.parse(timeSlot.split("-")[0]);
            LocalDateTime appointmentDateTime = LocalDateTime.of(appointmentDate, appointmentTime);
            return appointmentDateTime.isAfter(LocalDateTime.now());
        } catch (Exception e) {
            return false;
        }
    }

    // Preferred booking method with duplicate-slot prevention and race-condition handling
    public Optional<Appointment> validateAndBook(Appointment a) {
        return Optional.ofNullable(a)
            .filter(appointment -> appointment.getDoctorId() != null)
            .filter(appointment -> appointment.getPatientId() != null)
            .filter(appointment -> isValidAppointmentTime(appointment.getDate(), appointment.getTimeSlot()))
            .filter(appointment -> {
                boolean exists = repository.existsByDoctorIdAndDateAndTimeSlotAndStatus(
                    appointment.getDoctorId(), appointment.getDate(), appointment.getTimeSlot(), "BOOKED");
                return !exists;
            })
            .map(appointment -> {
                appointment.setStatus("BOOKED");
                try {
                    return repository.save(appointment);
                } catch (DataIntegrityViolationException e) {
                    // DB unique constraint caught (race condition) -> treat as conflict
                    return null;
                }
            })
            .filter(saved -> saved != null);
    }
}
