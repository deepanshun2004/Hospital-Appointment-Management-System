package com.hospital.appointment.controller;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {
	private final AppointmentService service;
	public AppointmentController(AppointmentService service) { this.service = service; }

	@GetMapping
	public List<Appointment> myAppointments(@RequestHeader(value = "X-Patient-Id", required = false) Long patientId) {
		// In real app, extract from JWT; here allow header fallback
		return patientId == null ? List.of() : service.forPatient(patientId);
	}

	@PostMapping("/book")
	public ResponseEntity<Appointment> book(@RequestBody Appointment a, @RequestHeader(value = "X-Patient-Id", required = false) Long patientId) {
		if (patientId != null) a.setPatientId(patientId);
		return service.validateAndBook(a)
			.map(ResponseEntity::ok)
			.orElse(ResponseEntity.status(HttpStatus.CONFLICT).body(null));
	}

	@PostMapping("/cancel")
	public ResponseEntity<?> cancel(@RequestBody Map<String, Long> body) {
		boolean cancelled = service.cancel(body.get("id"));
		return cancelled ? 
			ResponseEntity.ok(Map.of("status", "cancelled")) :
			ResponseEntity.notFound().build();
	}
}
