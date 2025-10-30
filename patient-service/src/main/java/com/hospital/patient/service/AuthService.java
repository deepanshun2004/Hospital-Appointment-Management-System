package com.hospital.patient.service;

import com.hospital.patient.entity.Patient;
import com.hospital.patient.repository.PatientRepository;
import com.hospital.patient.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;

@Service
public class AuthService {
    private final PatientRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // DTO for login response
    public static record LoginResponse(String token, String name) {}

    public AuthService(PatientRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Registration
    public Optional<Patient> register(String name, String email, String rawPassword) {
        return validateRegistrationData(name, email, rawPassword)
            .filter(valid -> repository.findByEmail(email).isEmpty())
            .map(ignored -> {
                Patient p = new Patient();
                p.setName(name);
                p.setEmail(email);
                p.setPassword(passwordEncoder.encode(rawPassword));
                return repository.save(p);
            });
    }

    // Login returns token + patient name
    public Optional<LoginResponse> login(String email, String rawPassword) {
        return repository.findByEmail(email)
            .filter(patient -> passwordEncoder.matches(rawPassword, patient.getPassword()))
            .map(patient -> new LoginResponse(generateTokenForPatient(patient), patient.getName()));
    }

    // === Helpers and functional examples ===
    private Optional<Boolean> validateRegistrationData(String name, String email, String password) {
        Predicate<String> isValidName = s -> s != null && s.trim().length() >= 2;
        Predicate<String> isValidEmail = s -> s != null && s.contains("@") && s.contains(".");
        Predicate<String> isValidPassword = s -> s != null && s.length() >= 6;

        return Optional.of(true)
            .filter(ignored -> isValidName.test(name))
            .filter(ignored -> isValidEmail.test(email))
            .filter(ignored -> isValidPassword.test(password));
    }

    private String generateTokenForPatient(Patient patient) {
        Function<Patient, Map<String, Object>> createClaims = p -> {
            Map<String, Object> claims = new HashMap<>();
            claims.put("patientId", p.getId());
            claims.put("name", p.getName());
            return claims;
        };
        return jwtService.generateToken(patient.getEmail(), createClaims.apply(patient));
    }

    public Optional<Patient> findPatientByEmail(String email) {
        return Optional.ofNullable(email)
            .filter(e -> !e.trim().isEmpty())
            .flatMap(repository::findByEmail);
    }

    public boolean isValidPatient(Patient patient) {
        Predicate<Patient> hasValidId = p -> p.getId() != null && p.getId() > 0;
        Predicate<Patient> hasValidName = p -> p.getName() != null && !p.getName().trim().isEmpty();
        Predicate<Patient> hasValidEmail = p -> p.getEmail() != null && p.getEmail().contains("@");

        return Optional.ofNullable(patient)
            .filter(hasValidId.and(hasValidName).and(hasValidEmail))
            .isPresent();
    }

    public Optional<Patient> updatePassword(Long patientId, String oldPassword, String newPassword) {
        return repository.findById(patientId)
            .filter(patient -> passwordEncoder.matches(oldPassword, patient.getPassword()))
            .filter(patient -> newPassword != null && newPassword.length() >= 6)
            .map(patient -> {
                patient.setPassword(passwordEncoder.encode(newPassword));
                return repository.save(patient);
            });
    }
}
