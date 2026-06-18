package com.example.uniCompass.repository;

import com.example.uniCompass.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByPointOfInterest(String pointOfInterest);
}
