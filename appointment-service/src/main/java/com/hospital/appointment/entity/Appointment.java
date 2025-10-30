package com.hospital.appointment.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "appointments",
    uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_id", "date", "time_slot"})
)
public class Appointment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "doctor_id")
	private Long doctorId;

	@Column(name = "patient_id")
	private Long patientId;

	@Column(name = "date")
	private String date;

	@Column(name = "time_slot")
	private String timeSlot;

	@Column(name = "status")
	private String status;

	public Appointment() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Long getDoctorId() { return doctorId; }
	public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
	public Long getPatientId() { return patientId; }
	public void setPatientId(Long patientId) { this.patientId = patientId; }
	public String getDate() { return date; }
	public void setDate(String date) { this.date = date; }
	public String getTimeSlot() { return timeSlot; }
	public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
}
