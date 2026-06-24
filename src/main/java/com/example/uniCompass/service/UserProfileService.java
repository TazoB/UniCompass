package com.example.uniCompass.service;

import com.example.uniCompass.dto.request.AcademicsUpdateRequest;
import com.example.uniCompass.dto.request.BasicsUpdateRequest;
import com.example.uniCompass.dto.request.PreferencesUpdateRequest;
import com.example.uniCompass.dto.response.UserProfileResponse;
import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.UserProfile;
import com.example.uniCompass.repository.UserProfileRepository;
import com.example.uniCompass.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfileResponse findUser(String email) {
        AppUser currentUser = takeUser(email);
        UserProfile profile = currentUser.getProfile();

        return new UserProfileResponse(currentUser, profile);
    }

    public void updateBasics(String email, BasicsUpdateRequest request) {
        AppUser currentUser = takeUser(email);
        UserProfile profile = currentUser.getProfile();

        profile.setFullName(request.getFullName());
        currentUser.setUsername(request.getUsername());
        currentUser.setEmail(request.getEmail());
        profile.setBio(request.getBio());
        profile.setProfilePicUrl(request.getProfilePicUrl());

        userRepository.save(currentUser);
    }

    public void updateAcademics(String email, AcademicsUpdateRequest request) {
        AppUser currentUser = takeUser(email);
        UserProfile profile = currentUser.getProfile();

        profile.setGpa(request.getGpa());
        profile.setIeltsScore(request.getIelts());
        profile.setToeflScore(request.getToefl());
        profile.setSatScore(request.getSat());

        userRepository.save(currentUser);
    }

    public void updatePreferences(String email, PreferencesUpdateRequest request) {
        AppUser currentUser = takeUser(email);
        UserProfile profile = currentUser.getProfile();

        profile.setPreferredCountry(request.getCountry());
        profile.setPreferredCity(request.getCity());
        profile.setPreferredState(request.getState());
        profile.setBudget(request.getBudget());
        profile.setPointOfInterest(request.getPoi());

        userRepository.save(currentUser);
    }

    private AppUser takeUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
