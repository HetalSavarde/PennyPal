package com.pennypal.pennypal.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bill_shares")
public class BillShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which bill
    @ManyToOne
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    // which user owes this share
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "share_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal shareAmount;

    private boolean settled = false;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public BillShare() {}

    public BillShare(User user, BigDecimal shareAmount) {
        this.user = user;
        this.shareAmount = shareAmount;
    }

    @PrePersist
    public void prePersist() {
        // nothing for now
    }

    // getters & setters
    public Long getId() { return id; }
    public Bill getBill() { return bill; }
    public void setBill(Bill bill) { this.bill = bill; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public BigDecimal getShareAmount() { return shareAmount; }
    public void setShareAmount(BigDecimal shareAmount) { this.shareAmount = shareAmount; }
    public boolean isSettled() { return settled; }
    public void setSettled(boolean settled) { this.settled = settled; if (settled) this.paidAt = LocalDateTime.now(); }
    public LocalDateTime getPaidAt() { return paidAt; }
}

