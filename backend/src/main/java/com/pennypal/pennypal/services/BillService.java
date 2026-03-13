package com.pennypal.pennypal.services;

import com.pennypal.pennypal.model.*;
import com.pennypal.pennypal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;
    @Autowired
    private UserGroupRepository userGroupRepository;
    @Autowired
    private BillShareRepository billShareRepository;
    @Autowired
    private UserGroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new group with owner and optional members.
     */
    @Transactional
    public UserGroup createGroup(String groupName, String ownerUsername, List<String> memberUsernames) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new NoSuchElementException("Owner not found"));

        UserGroup group = new UserGroup(groupName, owner);

        if (memberUsernames != null) {
            for (String username : memberUsernames) {
                userRepository.findByUsername(username).ifPresent(group::addMember);
            }
        }

        return groupRepository.save(group);
    }

    /**
     * Add an existing user to a group.
     */
    @Transactional
    public UserGroup addMemberToGroup(Long groupId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        UserGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group not found"));
        group.addMember(user);
        return groupRepository.save(group);
    }

    /**
     * Create a new bill split (even or custom).
     * NOTE: parameter order matches controller now.
     */
    @Transactional
    public Bill createBillSplit(
            String description,
            String creatorUsername,
            BigDecimal totalAmount,
            List<String> participantsUsernames,
            Long groupId,
            boolean splitEqually,
            Map<String, BigDecimal> explicitShares) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new NoSuchElementException("Creator not found"));

        UserGroup group = null;
        if (groupId != null) {
            group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new NoSuchElementException("Group not found"));

            // if participants empty, assume all group members
            if (participantsUsernames == null || participantsUsernames.isEmpty()) {
                participantsUsernames = group.getMembers().stream()
                        .map(User::getUsername)
                        .collect(Collectors.toList());
            }
        }

        // fetch participant User entities
        List<User> participants = new ArrayList<>();
        for (String username : participantsUsernames) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NoSuchElementException("User " + username + " not found"));
            participants.add(user);
        }

        // create bill
        Bill bill = new Bill(description, totalAmount, creator, group);
        bill = billRepository.save(bill);

        // compute shares
        if (splitEqually) {
            int n = participants.size();
            BigDecimal[] perPersonAndRemainder = splitEvenly(totalAmount, n);
            BigDecimal perPerson = perPersonAndRemainder[0];
            BigDecimal remainder = perPersonAndRemainder[1];

            // distribute remainder cents to the first users (avoid rounding loss)
            for (int i = 0; i < participants.size(); i++) {
                BigDecimal share = perPerson;
                if (i < remainder.intValue()) {
                    share = share.add(new BigDecimal("0.01"));
                }
                BillShare bs = new BillShare(participants.get(i), share);
                bs.setBill(bill);
                bill.addShare(bs);
            }
        } else {
            // explicitShares map must match participants
            if (explicitShares == null || explicitShares.isEmpty()) {
                throw new IllegalArgumentException("explicitShares must be provided when splitEqually=false");
            }

            BigDecimal sum = BigDecimal.ZERO;
            for (Map.Entry<String, BigDecimal> entry : explicitShares.entrySet()) {
                String username = entry.getKey();
                BigDecimal amt = entry.getValue().setScale(2, RoundingMode.HALF_UP);
                sum = sum.add(amt);

                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new NoSuchElementException("User " + username + " not found"));
                BillShare bs = new BillShare(user, amt);
                bs.setBill(bill);
                bill.addShare(bs);
            }

            // validate totals
            if (sum.compareTo(totalAmount.setScale(2, RoundingMode.HALF_UP)) != 0) {
                throw new IllegalArgumentException("Sum of explicit shares does not equal totalAmount");
            }
        }

        return billRepository.save(bill);
    }

    /**
     * Helper: returns [perPerson, remainderCount]
     */
    private BigDecimal[] splitEvenly(BigDecimal total, int n) {
        total = total.setScale(2, RoundingMode.HALF_UP);
        BigDecimal per = total.divide(new BigDecimal(n), 2, RoundingMode.DOWN);
        BigDecimal totalDistributed = per.multiply(new BigDecimal(n));
        BigDecimal remainder = total.subtract(totalDistributed)
                .multiply(new BigDecimal(100))
                .setScale(0, RoundingMode.HALF_UP);
        // remainder = number of cents leftover
        return new BigDecimal[] { per, remainder };
    }

    @Transactional(readOnly = true)
    public List<BillShare> getSharesForUser(String username) {
        return billShareRepository.findByUser_Username(username);
    }

    @Transactional
    public BillShare settleShare(Long shareId, String username) {
        BillShare share = billShareRepository.findById(shareId)
                .orElseThrow(() -> new NoSuchElementException("Share not found"));
        if (!share.getUser().getUsername().equals(username)) {
            throw new SecurityException("Cannot settle another user's share");
        }
        share.setSettled(true);
        return billShareRepository.save(share);
    }

    @Transactional(readOnly = true)
    public Optional<Bill> getBill(Long billId) {
        return billRepository.findById(billId);
    }

    @Transactional(readOnly = true)
    public List<Bill> getBillsForCreator(String username) {
        return billRepository.findByCreator_Username(username);
    }

    public List<UserGroup> getGroupsForUser(String username) {
        return userGroupRepository.findByMembers_Username(username);
    }

}
