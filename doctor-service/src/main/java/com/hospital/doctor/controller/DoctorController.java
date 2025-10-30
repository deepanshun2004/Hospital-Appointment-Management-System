package com.hospital.doctor.controller;

import com.hospital.doctor.entity.Doctor;
import com.hospital.doctor.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {
	private final DoctorService service;
	public DoctorController(DoctorService service) { this.service = service; }

	@GetMapping
	public List<Doctor> all() { return service.findAll(); }

	@GetMapping("/{id}")
	public ResponseEntity<Doctor> byId(@PathVariable Long id) {
		return service.findById(id)
			.map(ResponseEntity::ok)
			.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Doctor create(@RequestBody Doctor d) { return service.save(d); }

	@PutMapping("/{id}")
	public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Doctor d) {
		return service.findById(id)
			.map(existing -> {
				d.setId(id);
				return ResponseEntity.ok(service.save(d));
			})
			.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}
