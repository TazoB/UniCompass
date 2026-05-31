package com.example.uniCompass.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "faculty")
@Entity
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(nullable = false)
    private Double cost;

    @Column(name = "acceptance_rate", nullable = false)
    private Double acceptanceRate;

    @ManyToMany
    @JoinTable(
            name = "faculty_requirements",
            joinColumns = @JoinColumn(name = "faculty_id"),
            inverseJoinColumns = @JoinColumn(name = "requirement_id")
    )
    private List<Requirement> requirements;
}
