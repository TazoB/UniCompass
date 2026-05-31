package com.example.uniCompass.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "user_preferences")
@Entity
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "target_country", nullable = false)
    private String targetCountry;

    @Column(name = "target_state")
    private String targetState;

    @Column(name = "target_city", nullable = false)
    private String targetCity;

    @Column(name = "max_budget", nullable = false)
    private Double maxBudget;

    @Column(name = "school_type", nullable = false)
    private String schoolType;

    @ManyToMany
    @JoinTable(
            name = "user_preference_priorities",
            joinColumns = @JoinColumn(name = "preference_id"),
            inverseJoinColumns = @JoinColumn(name = "priority_id")
    )
    private List<Priority> priorities;
}
