package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
	List<Appointment> findByPatientId(Long patientId);
	boolean existsByDoctorIdAndDateAndTimeSlotAndStatus(Long doctorId, String date, String timeSlot, String status);
}
