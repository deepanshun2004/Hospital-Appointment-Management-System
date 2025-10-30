package com.hospital.doctor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String specialization;
	private String availability;

	public Doctor() {}

	public Doctor(String name, String specialization, String availability) {
		this.name = name;
		this.specialization = specialization;
		this.availability = availability;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getSpecialization() { return specialization; }
	public void setSpecialization(String specialization) { this.specialization = specialization; }
	public String getAvailability() { return availability; }
	public void setAvailability(String availability) { this.availability = availability; }
}
