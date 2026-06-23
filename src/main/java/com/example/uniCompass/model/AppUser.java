package com.example.uniCompass.model;

import com.example.uniCompass.dto.request.FullRegistrationRequest;
import com.example.uniCompass.roles.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;
import java.util.List;
import java.util.Locale;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "app_users")
public class AppUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLanguage> languages;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserChecklist> checklist;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_universities",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id")
    )
    private List<University> favoriteUniversities;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_programs",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "program_id")
    )
    private List<Program> favoritePrograms;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(UserRole.USER_ROLE.toString()));
    }

    public String getRealUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public AppUser(FullRegistrationRequest request, PasswordEncoder passwordEncoder) {
        FullRegistrationRequest.Basics basics = request.getBasics();
        this.username = basics.getUsername();
        this.email = basics.getEmail().toLowerCase(Locale.ROOT);
        this.passwordHash = passwordEncoder.encode(basics.getPassword());

        if (request.getLanguages() != null) {
            List<UserLanguage> languageEntities = request.getLanguages().stream()
                    .map(langString -> {
                        UserLanguage langEntity = new UserLanguage();

                        if (langString.contains("(") && langString.contains(")")) {
                            int startIdx = langString.lastIndexOf("(");
                            int endIdx = langString.lastIndexOf(")");

                            String name = langString.substring(0, startIdx).trim();

                            String level = langString.substring(startIdx + 1, endIdx).trim();

                            langEntity.setLanguageName(name);
                            langEntity.setProficiencyLevel(level);
                        } else {
                            langEntity.setLanguageName(langString.trim());
                            langEntity.setProficiencyLevel("Unspecified");
                        }

                        langEntity.setUser(this);
                        return langEntity;
                    })
                    .toList();

            this.setLanguages(languageEntities);
        }
    }
}
