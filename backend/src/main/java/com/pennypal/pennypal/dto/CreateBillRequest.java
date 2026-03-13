package com.pennypal.pennypal.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class CreateBillRequest {
    private String description;
    private BigDecimal totalAmount;
    private List<String> participants; // usernames
    private Long groupId; // optional: create bill for group
    private boolean splitEqually = true;
    // if splitEqually == false, provide explicit map username->amount
    private Map<String, BigDecimal> explicitShares;

    // getters & setters
    // ...
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public boolean isSplitEqually() { return splitEqually; }
    public void setSplitEqually(boolean splitEqually) { this.splitEqually = splitEqually; }
    public Map<String, BigDecimal> getExplicitShares() { return explicitShares; }
    public void setExplicitShares(Map<String, BigDecimal> explicitShares) { this.explicitShares = explicitShares; }
}

