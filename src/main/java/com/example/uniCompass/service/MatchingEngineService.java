package com.example.uniCompass.service;

import com.example.uniCompass.dto.response.GapType;
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
import java.util.Comparator;
import java.util.List;

@Service
public class MatchingEngineService {
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    private static final double ACADEMIC_WEIGHT = 0.50;
    private static final double LANGUAGE_WEIGHT = 0.30;
    private static final double FINANCIAL_WEIGHT = 0.15;
    private static final double EXTRACURRICULAR_WEIGHT = 0.05;

    private List<UniversityMatchResponse.GapAnalysisDetails> details;

    public MatchingEngineService(UserRepository userRepository, UniversityRepository universityRepository) {
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
    }

    public UniversityMatchResponse universityMatch(String username, Long universityId) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        UserProfile profile = user.getProfile();
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new IllegalArgumentException("University not found"));
        List<Program> universityPrograms = university.getPrograms();
        List<UniversityMatchResponse.ProgramMatch> programMatches = new ArrayList<>();

        details = new ArrayList<>();

        for (Program program : universityPrograms) {
            if(! program.getPointOfInterest().equalsIgnoreCase(profile.getPointOfInterest())) {
                continue;
            }

            int percentage = calculateProgramMatch(profile, program, true);
            String level = getMatchLevel(true, percentage);
            if(percentage > 30) {
                programMatches.add(new UniversityMatchResponse.ProgramMatch(
                        program.getId(),
                        program.getName(),
                        percentage,
                        level
                ));
            }
        }

        programMatches = programMatches
                .stream()
                .sorted(Comparator.comparing(UniversityMatchResponse.ProgramMatch::getMatchPercentage).reversed())
                .toList();

        return new UniversityMatchResponse(
                university,
                user.getId(),
                programMatches,
                details
        );
    }

    public List<PersonalizedPinResponse> matchPins(String username) {
        AppUser user = userRepository.findByUsername(username)
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

                int currentPercentage = calculateProgramMatch(user.getProfile(), program, false);
                if(currentPercentage > percentage) percentage = currentPercentage;
            }
        }

        return new PersonalizedPinResponse(
                university,
                percentage,
                getMatchLevel(hasRelevantProgram, percentage)
        );
    }

    private int calculateProgramMatch(UserProfile profile, Program program, boolean isUniversityChosen) {
        double academicScore = calculateAcademicScore(profile.getGpa(), program.getTargetGpa(), isUniversityChosen);
        double financialScore = calculateFinancialScore(
                profile.getBudget(), program.getYearlyTuition(), isUniversityChosen
        );
        double languageScore = calculateLanguageScore(profile, program, isUniversityChosen);
        double extracurricularScore = calculateExtracurricularScore(
                profile.getExtracurriculars(), program.getDesiredTraits(), isUniversityChosen
        );

        return (int) (academicScore * ACADEMIC_WEIGHT
                + financialScore * FINANCIAL_WEIGHT
                + languageScore * LANGUAGE_WEIGHT
                + extracurricularScore * EXTRACURRICULAR_WEIGHT);
    }

    private double calculateAcademicScore(double gpa, double targetGpa, boolean isUniversityChosen) {
        if (gpa >= targetGpa) {
            return 100.0;
        } else {
            if(isUniversityChosen) {
                details.add(getGpaGapDetail(gpa, targetGpa));
            }
        }
        return (gpa / targetGpa) * 100.0;
    }

    private double calculateFinancialScore(int budget, int yearlyTuition, boolean isUniversityChosen) {
        if (budget >= yearlyTuition) {
            return 100.0;
        } else {
            if(isUniversityChosen) {
                details.add(getFinancialGapDetail(budget, yearlyTuition));
            }
        }
        return ((double) budget / yearlyTuition) * 100.0;
    }

    private double calculateLanguageScore(UserProfile profile, Program program, boolean isUniversityChosen) {
        Double ielts = profile.getIeltsScore(), targetIelts = program.getMinIelts();
        Integer toefl = profile.getToeflScore(), targetToefl = program.getMinToefl();

        double ieltsPercentage = -1, toeflPercentage = -1;

        if(ielts != null && targetIelts != null) {
            if(ielts >= targetIelts) return 100;
            else ieltsPercentage = (ielts / targetIelts) * 100;
        }
        if(toefl != null && targetToefl != null) {
            if(toefl >= targetToefl) return 100;
            else toeflPercentage = ((double) toefl / targetToefl) * 100;
        }

        if(ieltsPercentage == -1 && toeflPercentage == -1) return 0;

        if(ieltsPercentage > toeflPercentage) {
            if(isUniversityChosen) {
                details.add(getIeltsGapDetail(ielts, targetIelts));
            }
            return ieltsPercentage;
        }
        if(isUniversityChosen) {
            details.add(getToeflGapDetail(toefl, targetToefl));
        }
        return toeflPercentage;
    }

    private double calculateExtracurricularScore(List<String> extracurriculars, List<String> desiredTraits, boolean isUniversityChosen) {
        if(desiredTraits == null || desiredTraits.isEmpty()) return 100;
        if(extracurriculars == null || extracurriculars.isEmpty()) return 0;

        int count = 0;
        List<String> missingTraits = new ArrayList<>();

        for (String trait : desiredTraits) {
            boolean traitExists = false;

            for (String extracurricular : extracurriculars) {
                if(extracurricular.contains(trait.toLowerCase())) {
                    traitExists = true;
                    break;
                }
            }
            if(traitExists) count++;
            else missingTraits.add(trait);
        }

        double percentage = ((double) count / desiredTraits.size()) * 100;
        if(percentage != 100 && isUniversityChosen) {
            details.add(getExtracurricularDetail(missingTraits));
        }
        return percentage;
    }

    private String getMatchLevel(boolean hasRelevantProgram, int percentage) {
        if(!hasRelevantProgram) return "none";
        else if(percentage >= 80) return "high";
        else if(percentage >= 50) return "med";
        return "low";
    }

    private UniversityMatchResponse.GapAnalysisDetails getGpaGapDetail(double gpa, double targetGpa) {
        return new UniversityMatchResponse.GapAnalysisDetails(
                GapType.ACADEMIC,
                "calculator",
                "GPA requirement",
                "Your GPA is " + gpa + " but this program requires " + targetGpa + "."
        );
    }

    private UniversityMatchResponse.GapAnalysisDetails getFinancialGapDetail(double budget, double tuition) {
        return new UniversityMatchResponse.GapAnalysisDetails(
                GapType.FINANCIAL,
                "coins",
                "Budget alert",
                "Your budget is $" + budget + " but tuition is $" + tuition + "."
        );
    }

    private UniversityMatchResponse.GapAnalysisDetails getIeltsGapDetail(double ielts, double minIelts) {
        return new UniversityMatchResponse.GapAnalysisDetails(
                GapType.LANGUAGE,
                "languages",
                "Language Requirement Not Met",
                "Your IELTS score is " + ielts + " but this program requires at least " + minIelts + "."
        );
    }

    private UniversityMatchResponse.GapAnalysisDetails getToeflGapDetail(int toefl, int minToefl) {
        return new UniversityMatchResponse.GapAnalysisDetails(
                GapType.LANGUAGE,
                "languages",
                "Language Requirement Not Met",
                "Your TOEFL score is " + toefl + " but this program requires at least " + minToefl + "."
        );
    }

    private UniversityMatchResponse.GapAnalysisDetails getExtracurricularDetail(List<String> gaps) {
        StringBuilder builder = new StringBuilder();
        for (String gap : gaps) {
            builder.append(gap).append(" ");
        }

        return new UniversityMatchResponse.GapAnalysisDetails(
                GapType.EXTRACURRICULAR,
                "microscope",
                "Missing Experience",
                "Your profile lacks formal keywords that this program highly values: " + builder +
                        "Consider gaining experience in these areas or updating your activity descriptions."
        );
    }
}
