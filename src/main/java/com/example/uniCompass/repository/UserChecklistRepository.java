package com.example.uniCompass.repository;

import com.example.uniCompass.model.UserChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserChecklistRepository extends JpaRepository<UserChecklist, Long> {
}
