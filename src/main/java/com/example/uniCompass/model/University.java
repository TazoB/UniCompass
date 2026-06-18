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
@Table(name = "universities")
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(precision = 9, scale = 6)
    private Double latitude;

    @Column(precision = 9, scale = 6)
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "world_ranking")
    private Integer worldRanking;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Program> programs;

    @ManyToMany(mappedBy = "favoriteUniversities")
    private List<AppUser> favoriteByUsers;
}
