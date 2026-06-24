package com.example.uniCompass.service;

import com.example.uniCompass.dto.response.PersonalizedPinResponse;
import com.example.uniCompass.dto.response.UniversityMatchResponse;
import com.example.uniCompass.model.AppUser;
import com.example.uniCompass.model.Program;
import com.example.uniCompass.model.University;
import com.example.uniCompass.model.UserProfile;
import com.example.uniCompass.repository.UniversityRepository;
import com.example.uniCompass.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingEngineService {
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    public MatchingEngineService(UserRepository userRepository, UniversityRepository universityRepository) {
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
    }

    public UniversityMatchResponse universityMatch(String email, Long universityId) {
        return null;
    }

    public List<PersonalizedPinResponse> matchPins(String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<University> universities = universityRepository.findAll();
        List<PersonalizedPinResponse> response = new ArrayList<>();

        String userPoi = user.getProfile().getPointOfInterest();

        for (University university : universities) {
            PersonalizedPinResponse pinResponse = getPersonalizedPinResponse(university, userPoi, user);
            response.add(pinResponse);
        }
        return response;
    }

    private PersonalizedPinResponse getPersonalizedPinResponse(University university, String userPoi, AppUser user) {
        int percentage = 0;
        boolean hasRelevantProgram = false;

        for (Program program : university.getPrograms()) {
            if(program.getPointOfInterest().equals(userPoi)) {
                hasRelevantProgram = true;

                int currentPercentage = calculateProgramMatch(user.getProfile(), program);
                if(currentPercentage > percentage) percentage = currentPercentage;
            }
        }

        return new PersonalizedPinResponse(
                university,
                percentage,
                getMatchLevel(hasRelevantProgram, percentage)
        );
    }

    private int calculateProgramMatch(UserProfile profile, Program program) {
        return 0;
    }

    private String getMatchLevel(boolean hasRelevantProgram, int percentage) {
        if(!hasRelevantProgram) return "none";
        else if(percentage >= 80) return "high";
        else if(percentage >= 50) return "med";
        return "low";
    }
}
