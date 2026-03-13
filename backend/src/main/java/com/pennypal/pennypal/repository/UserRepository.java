package com.pennypal.pennypal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pennypal.pennypal.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    User findByEmail(String email);
}
