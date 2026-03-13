package com.pennypal.pennypal.services;

import com.pennypal.pennypal.model.Transaction;
import com.pennypal.pennypal.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getUser() == null || transaction.getUser().getId() == null) {
            throw new IllegalArgumentException("User must be specified for a transaction");
        }
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
    public List<Transaction> getTransactionsForUser(String username) {
        return transactionRepository.findByUser_Username(username);
    }
}