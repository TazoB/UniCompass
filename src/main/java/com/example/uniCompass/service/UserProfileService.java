package com.example.uniCompass.service;

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
        AppUser currentUser = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = currentUser.getProfile();

        return new UserProfileResponse(currentUser, profile);
    }
}
