package com.example.uniCompass.model;

import lombok.*;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class UserDTO {
    private String fullName;
    private String email;
    private String password;
}
