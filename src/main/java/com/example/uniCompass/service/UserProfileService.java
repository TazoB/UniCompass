package com.example.uniCompass.service;

import com.example.uniCompass.dto.request.*;
import com.example.uniCompass.dto.response.UserProfileResponse;
import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.UserChecklist;
import com.example.uniCompass.model.UserLanguage;
import com.example.uniCompass.model.UserProfile;
import com.example.uniCompass.repository.UserProfileRepository;
import com.example.uniCompass.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfileResponse findUser(String username) {
        AppUser currentUser = takeUser(username);
        UserProfile profile = currentUser.getProfile();

        return new UserProfileResponse(currentUser, profile);
    }

    public void updateBasics(String username, BasicsUpdateRequest request) {
        AppUser currentUser = takeUser(username);
        UserProfile profile = currentUser.getProfile();

        profile.setFullName(request.getFullName());
        currentUser.setUsername(request.getUsername());
        currentUser.setEmail(request.getEmail());
        profile.setBio(request.getBio());
        profile.setProfilePicUrl(request.getProfilePicUrl());

        userRepository.save(currentUser);
    }

    public void updateAcademics(String username, AcademicsUpdateRequest request) {
        AppUser currentUser = takeUser(username);
        UserProfile profile = currentUser.getProfile();

        profile.setGpa(request.getGpa());
        profile.setIeltsScore(request.getIelts());
        profile.setToeflScore(request.getToefl());
        profile.setSatScore(request.getSat());

        userRepository.save(currentUser);
    }

    public void updatePreferences(String username, PreferencesUpdateRequest request) {
        AppUser currentUser = takeUser(username);
        UserProfile profile = currentUser.getProfile();

        profile.setPreferredCountry(request.getCountry());
        profile.setPreferredCity(request.getCity());
        profile.setPreferredState(request.getState());
        profile.setBudget(request.getBudget());
        profile.setPointOfInterest(request.getPoi());

        userRepository.save(currentUser);
    }

    public void updateExtracurriculars(String username, List<String> extracurriculars) {
        AppUser currentUser = takeUser(username);
        UserProfile profile = currentUser.getProfile();

        if (profile.getExtracurriculars() != null) {
            profile.getExtracurriculars().clear();
        } else {
            profile.setExtracurriculars(new java.util.ArrayList<>());
        }

        if (extracurriculars != null) {
            profile.getExtracurriculars().addAll(extracurriculars);
        }

        userRepository.save(currentUser);
    }

    public void updateSkills(String username, List<String> skills) {
        AppUser currentUser = takeUser(username);
        UserProfile profile = currentUser.getProfile();

        if (profile.getSkills() != null) {
            profile.getSkills().clear();
        } else {
            profile.setSkills(new java.util.ArrayList<>());
        }

        if (skills != null) {
            profile.getSkills().addAll(skills);
        }

        userRepository.save(currentUser);
    }

    public void updateLanguages(String username, List<LanguageDTO> languages) {
        AppUser currentUser = takeUser(username);

        if (currentUser.getLanguages() != null) {
            currentUser.getLanguages().clear();
        } else {
            currentUser.setLanguages(new java.util.ArrayList<>());
        }

        if (languages != null) {
            for (LanguageDTO language : languages) {
                currentUser.getLanguages().add(
                        new UserLanguage(
                                currentUser,
                                language.getLanguage(),
                                language.getLevel()
                        )
                );
            }
        }
        userRepository.save(currentUser);
    }

    public void updateChecklist(String username, List<ChecklistDTO> checklistItems) {
        AppUser currentUser = takeUser(username);

        if (currentUser.getChecklist() != null) {
            currentUser.getChecklist().clear();
        } else {
            currentUser.setChecklist(new java.util.ArrayList<>());
        }

        if (checklistItems != null) {
            for (ChecklistDTO checklistItem : checklistItems) {
                currentUser.getChecklist().add(
                        new UserChecklist(
                                currentUser,
                                checklistItem.getText(),
                                checklistItem.getCompleted()
                        )
                );
            }
        }
        userRepository.save(currentUser);
    }
    private AppUser takeUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
