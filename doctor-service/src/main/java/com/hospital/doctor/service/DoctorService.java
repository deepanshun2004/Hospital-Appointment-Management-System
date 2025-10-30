package com.hospital.doctor.service;

import com.hospital.doctor.entity.Doctor;
import com.hospital.doctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.Map;

@Service
public class DoctorService {
	private final DoctorRepository repository;

	public DoctorService(DoctorRepository repository) {
		this.repository = repository;
	}

	// Traditional method enhanced with Optional
	public List<Doctor> findAll() { 
		return repository.findAll(); 
	}

	// Enhanced with Optional for null safety
	public Optional<Doctor> findById(Long id) { 
		return repository.findById(id); 
	}

	public Doctor save(Doctor d) { 
		return repository.save(d); 
	}

	public void delete(Long id) { 
		repository.deleteById(id); 
	}

	// === FUNCTIONAL PROGRAMMING EXAMPLES ===

	// Lambda expressions with Stream API
	public List<Doctor> findBySpecialization(String specialization) {
		return repository.findAll().stream()
			.filter(doctor -> doctor.getSpecialization().equalsIgnoreCase(specialization))
			.collect(Collectors.toList());
	}

	// Higher-order function with Predicate functional interface
	public List<Doctor> findDoctorsBy(Predicate<Doctor> condition) {
		return repository.findAll().stream()
			.filter(condition)
			.collect(Collectors.toList());
	}

	// Method reference example
	public List<String> getAllDoctorNames() {
		return repository.findAll().stream()
			.map(Doctor::getName)  // Method reference
			.sorted(String::compareToIgnoreCase)  // Method reference
			.collect(Collectors.toList());
	}

	// Complex functional operations with multiple higher-order functions
	public Map<String, List<Doctor>> groupBySpecialization() {
		return repository.findAll().stream()
			.collect(Collectors.groupingBy(Doctor::getSpecialization));
	}

	// Function composition example
	public List<String> getFormattedDoctorInfo() {
		Function<Doctor, String> formatDoctor = doctor -> 
			String.format("Dr. %s (%s) - %s", 
				doctor.getName(), 
				doctor.getSpecialization(), 
				doctor.getAvailability());

		return repository.findAll().stream()
			.map(formatDoctor)
			.sorted()
			.collect(Collectors.toList());
	}

	// Optional chaining and functional operations
	public Optional<Doctor> findMostExperiencedDoctor() {
		return repository.findAll().stream()
			.max(Comparator.comparing(Doctor::getName)); // Simple comparison for demo
	}

	// Reduce operation example
	public long countAvailableDoctors() {
		return repository.findAll().stream()
			.filter(doctor -> "Available".equalsIgnoreCase(doctor.getAvailability()))
			.count();
	}

	// Complex lambda with multiple conditions
	public List<Doctor> findAvailableSpecialists(String specialization) {
		return repository.findAll().stream()
			.filter(doctor -> doctor.getSpecialization().equalsIgnoreCase(specialization))
			.filter(doctor -> "Available".equalsIgnoreCase(doctor.getAvailability()))
			.sorted(Comparator.comparing(Doctor::getName))
			.collect(Collectors.toList());
	}

	// Functional interface usage with custom logic
	public boolean existsDoctorMatching(Predicate<Doctor> condition) {
		return repository.findAll().stream()
			.anyMatch(condition);
	}

	// Optional with functional operations
	public Optional<String> getRandomDoctorName() {
		return repository.findAll().stream()
			.findFirst()
			.map(Doctor::getName)
			.map(String::toUpperCase);
	}
}
