package com.pennypal.pennypal.controller;

import com.pennypal.pennypal.config.JwtUtil;
import com.pennypal.pennypal.model.Transaction;
import com.pennypal.pennypal.model.User;
import com.pennypal.pennypal.repository.TransactionRepository;
import com.pennypal.pennypal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Add Transaction (JWT-authenticated)
    @PostMapping("/add")
    public ResponseEntity<?> addTransaction(@RequestBody Map<String, Object> payload,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            // Extract username from JWT
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            // Find user by username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found for username: " + username));

            // Extract fields
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            String category = (String) payload.get("category");
            String type = (String) payload.get("type");
            LocalDate transactionDate = payload.containsKey("transactionDate")
                    ? LocalDate.parse(payload.get("transactionDate").toString())
                    : LocalDate.now();

            // Create and save transaction
            Transaction tx = new Transaction();
            tx.setUser(user);
            tx.setAmount(amount);
            tx.setCategory(category);
            tx.setType(type);
            tx.setTransactionDate(transactionDate);

            Transaction saved = transactionRepository.save(tx);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ Get Transactions for logged-in user
    @GetMapping
    public ResponseEntity<?> getUserTransactions(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found for username: " + username));

            List<Transaction> transactions = transactionRepository.findByUser(user);
            return ResponseEntity.ok(transactions);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}


