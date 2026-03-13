package com.pennypal.pennypal.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    // optional: if this bill belongs to a group
    @ManyToOne
    @JoinColumn(name = "group_id")
    private UserGroup group;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BillShare> shares = new HashSet<>();

    public Bill() {}

    public Bill(String description, BigDecimal totalAmount, User creator, UserGroup group) {
        this.description = description;
        this.totalAmount = totalAmount;
        this.creator = creator;
        this.group = group;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }

    // getters & setters
    public Long getId() { return id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    public UserGroup getGroup() { return group; }
    public void setGroup(UserGroup group) { this.group = group; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Set<BillShare> getShares() { return shares; }
    public void setShares(Set<BillShare> shares) { this.shares = shares; }
    public void addShare(BillShare share) {
        this.shares.add(share);
        share.setBill(this);
    }
}

