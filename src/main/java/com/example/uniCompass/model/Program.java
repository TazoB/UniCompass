package com.example.uniCompass.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "programs")
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "point_of_interest", nullable = false)
    private String pointOfInterest;

    @Column(name = "target_gpa")
    private Double targetGpa;

    @Column(name = "target_sat")
    private Integer targetSat;

    @Column(name = "min_toefl")
    private Integer minToefl;

    @Column(name = "min_ielts")
    private Double minIelts;

    @Column(name = "yearly_tuition")
    private Integer yearlyTuition;

    @CollectionTable(name = "program_desired_traits", joinColumns = @JoinColumn(name = "program_id"))
    @Column(name = "trait")
    private List<String> desiredTraits;
}
