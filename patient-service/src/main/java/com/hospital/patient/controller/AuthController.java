package com.hospital.patient.controller;

import com.hospital.patient.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "*")
public class AuthController {
	private final AuthService authService;
	public AuthController(AuthService authService) { this.authService = authService; }

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
		return authService.register(body.get("name"), body.get("email"), body.get("password"))
			.map(patient -> ResponseEntity.ok(Map.of("message", "registered")))
			.orElse(ResponseEntity.badRequest().body(Map.of("error", "registration_failed")));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
		return authService.login(body.get("email"), body.get("password"))
			.map(lr -> ResponseEntity.ok(Map.of("token", lr.token(), "name", lr.name())))
			.orElse(ResponseEntity.status(401).body(Map.of("error", "invalid_credentials")));
	}
}
