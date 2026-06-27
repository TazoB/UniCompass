package com.example.uniCompass.model;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "user_checklists")
public class UserChecklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "task_text", nullable = false)
    private String taskText;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    public UserChecklist(AppUser user, String taskText, Boolean isCompleted) {
        this.user = user;
        this.taskText = taskText;
        this.isCompleted = isCompleted;
    }
}
