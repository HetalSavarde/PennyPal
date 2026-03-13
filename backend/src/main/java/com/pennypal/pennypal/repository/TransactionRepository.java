package com.pennypal.pennypal.repository;

import com.pennypal.pennypal.model.Transaction;
import com.pennypal.pennypal.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUser_Username(String username);
    List<Transaction> findByUser(User user);

}