package com.pennypal.pennypal.services;

import com.pennypal.pennypal.model.User;
import com.pennypal.pennypal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User signup(User user) throws Exception {
        System.out.println("user details:" + user);
        try {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                throw new IllegalArgumentException("Username already exists");
            }

            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash())); // Hash password
            System.out.println("user details post hashing:" + user);
            return userRepository.save(user);

        } catch (Exception ex) {
            ex.printStackTrace();
            throw new Exception(ex);
        }

    }

    public boolean validateUser(String userName, String password) {
        User existingUser = findByUsername(userName);
        if (existingUser != null && passwordEncoder.matches(password, existingUser.getPasswordHash())) {
            return true;
        }
        return false;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found")); // Add this method to UserRepository
                                                                                  // if not present
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}
