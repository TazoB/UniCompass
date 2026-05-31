package com.example.uniCompass.service;

import com.example.uniCompass.model.User;
import com.example.uniCompass.model.UserDTO;
import com.example.uniCompass.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserDTO save(UserDTO user) {
        User user1 = new User(
                user.getFullName(),
                user.getEmail(),
                user.getPassword()
        );
        if(findByEmail(user.getEmail()) == null) {
            User res = repository.save(user1);
            return new UserDTO(res.getFullName(), res.getEmail(), res.getPassword());
        }
        else return null;
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(int id) {
        return repository.findById(id).orElseThrow();
    }

    public User findByEmail(String email) {
        List<User> users = repository.findByEmail(email);
        if(users.isEmpty()) return null;
        return users.getFirst();
    }

    public boolean userExists(String email) {
        return findByEmail(email) != null;
    }
}
