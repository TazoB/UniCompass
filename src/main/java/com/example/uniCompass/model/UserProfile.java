package com.example.uniCompass.model;

import com.example.uniCompass.dto.request.FullRegistrationRequest;
import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;
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

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

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
    @Column(name = "extracurriculars")
    private List<String> extracurriculars;

    public UserProfile(FullRegistrationRequest request) {
        FullRegistrationRequest.Basics basics = request.getBasics();
        FullRegistrationRequest.Preferences preferences = request.getPreferences();
        FullRegistrationRequest.Academics academics = request.getAcademics();

        this.fullName = basics.getFullName();
        this.preferredCountry = preferences.getCountry();
        this.preferredCity = preferences.getCity();
        this.preferredState = preferences.getState();
        this.budget = preferences.getBudget();
        this.pointOfInterest = preferences.getPoi();

        this.gpa = academics.getGpa();
        this.satScore = academics.getSat();
        this.toeflScore = academics.getToefl();
        this.ieltsScore = academics.getIelts();

        if (request.getSkills() != null) {
            this.skills = request.getSkills();
        }

        if (request.getExtracurriculars() != null) {
            this.extracurriculars = request.getExtracurriculars();
        }

        this.profilePicUrl = getProfilePicUrlGenerated(basics.getFullName());
    }

    private String getProfilePicUrlGenerated(String fullName) {
        String firstName = Arrays.stream(fullName.split(" ")).toList().getFirst();
        String secondName = Arrays.stream(fullName.split(" ")).toList().get(1);

        return "https://ui-avatars.com/api/?name=" + firstName + "+" + secondName + "&background=2563eb&color=fff&size=150";
    }
}
