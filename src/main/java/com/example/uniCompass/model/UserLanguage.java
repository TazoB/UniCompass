package com.example.uniCompass.model;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "user_languages")
public class UserLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "language_name", nullable = false)
    private String languageName;

    @Column(name = "proficiency_level", nullable = false)
    private String proficiencyLevel;

    public UserLanguage(AppUser user, String languageName, String proficiencyLevel) {
        this.user = user;
        this.languageName = languageName;
        this.proficiencyLevel = proficiencyLevel;
    }
}
