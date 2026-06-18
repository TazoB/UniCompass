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
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "gpa", nullable = false)
    private Double gpa;

    @Column(name = "sat_score")
    private Integer satScore;

    @Column(name = "toefl_score")
    private Integer toeflScore;

    @Column(name = "ielts_score")
    private Double ieltsScore;

    @Column(name = "budget", nullable = false)
    private Integer budget;

    @Column(name = "point_of_interest", nullable = false)
    private String pointOfInterest;

    @Column(name = "preferred_country")
    private String preferredCountry;

    @Column(name = "preferred_city")
    private String preferredCity;

    @Column(name = "preferred_state")
    private String preferredState;

    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private List<String> skills;

    @CollectionTable(name = "user_extracurriculars", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "activity")
    private List<String> extracurriculars;
}
