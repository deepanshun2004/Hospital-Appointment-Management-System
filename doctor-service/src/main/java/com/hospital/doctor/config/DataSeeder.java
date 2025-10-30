package com.hospital.doctor.config;

import com.hospital.doctor.entity.Doctor;
import com.hospital.doctor.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
	@Bean
	CommandLineRunner seedDoctors(DoctorRepository repo) {
		return args -> {
			// Clear existing doctors and add fresh ones
			repo.deleteAll();
			System.out.println("Clearing old doctors and adding fresh ones...");
			
			repo.save(new Doctor("Dr. Rajesh Kumar", "Cardiology", "Mon-Fri"));
			repo.save(new Doctor("Dr. Priya Sharma", "Dermatology", "Tue-Thu"));
			repo.save(new Doctor("Dr. Amit Patel", "Pediatrics", "Mon-Wed"));
			repo.save(new Doctor("Dr. Meera Reddy", "Neurology", "Wed-Fri"));
			repo.save(new Doctor("Dr. Sanjay Gupta", "Orthopedics", "Mon-Thu"));
			repo.save(new Doctor("Dr. Anjali Desai", "Gynecology", "Tue-Fri"));
			repo.save(new Doctor("Dr. Vikram Singh", "Psychiatry", "Mon-Wed"));
			repo.save(new Doctor("Dr. Kavita Iyer", "Ophthalmology", "Wed-Sat"));
			repo.save(new Doctor("Dr. Arjun Malhotra", "ENT", "Mon-Fri"));
			repo.save(new Doctor("Dr. Sunita Verma", "Dentistry", "Tue-Sat"));
			
			System.out.println("Added " + repo.count() + " fresh doctors to the database");
		};
	}
}
