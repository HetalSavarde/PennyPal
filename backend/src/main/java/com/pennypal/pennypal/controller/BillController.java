package com.pennypal.pennypal.controller;

import com.pennypal.pennypal.dto.CreateBillRequest;
import com.pennypal.pennypal.dto.CreateGroupRequest;
import com.pennypal.pennypal.model.*;
import com.pennypal.pennypal.services.BillService;
import com.pennypal.pennypal.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bills") // ✅ Consistent base URL versioning
public class BillController {

    @Autowired
    private BillService billService;
    @Autowired
    private UserRepository userRepository;

    /*-----------------------------------------------------
     * GROUP MANAGEMENT ENDPOINTS
     *----------------------------------------------------*/

    // ✅ Create a new group
    @PostMapping("/groups")
    public ResponseEntity<UserGroup> createGroup(
            @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String owner = userDetails.getUsername();
        UserGroup created = billService.createGroup(request.getName(), owner, request.getMembers());
        return ResponseEntity.ok(created);
    }

    // ✅ Add a member to existing group
    @PostMapping("/groups/{groupId}/members")
    public ResponseEntity<UserGroup> addMember(
            @PathVariable Long groupId,
            @RequestParam String username,
            @AuthenticationPrincipal UserDetails userDetails) {

        UserGroup group = billService.addMemberToGroup(groupId, username);
        return ResponseEntity.ok(group);
    }

    // ✅ NEW: View all groups for the current user (for dashboard)
    @GetMapping("/groups")
    public ResponseEntity<List<?>> getMyGroups(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<UserGroup> groups = billService.getGroupsForUser(username);
        List<?> groupsDto = groups.stream().map(grp -> new Object(){
            public final Long id = grp.getId();
            public final String name = grp.getName();
            //public final User owner = grp.getOwner();
            public final String[] members = grp.getMembers().stream().map(s -> s.getUsername()).toArray(String[]::new);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(groupsDto);
    }

    /*-----------------------------------------------------
     * BILL MANAGEMENT ENDPOINTS
     *----------------------------------------------------*/

    // ✅ Create a bill split (explicit participants or group)
    @PostMapping("/split")
    public ResponseEntity<Bill> createBillSplit(
            @RequestBody CreateBillRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Bill bill = billService.createBillSplit(
                request.getDescription(),
                userDetails.getUsername(),
                request.getTotalAmount(),
                request.getParticipants(),
                request.getGroupId(),
                request.isSplitEqually(),
                request.getExplicitShares());
        return ResponseEntity.ok(bill);
    }

    /*-----------------------------------------------------
     * BILL SHARE OPERATIONS
     *----------------------------------------------------*/

    // ✅ Get all bills/shares for logged-in user
    @GetMapping("/my-shares")
    public ResponseEntity<List<?>> getMyShares(@AuthenticationPrincipal UserDetails userDetails) {
        List<BillShare> shares = billService.getSharesForUser(userDetails.getUsername());

        List<?> dto = shares.stream().map(s -> new Object() {
            public final Long id = s.getId();
            public final Long billId = s.getBill().getId();
            public final String description = s.getBill().getDescription();
            public final String creator = s.getBill().getCreator().getUsername();
            public final String groupName = (s.getBill().getGroup() != null)
                    ? s.getBill().getGroup().getName()
                    : null;
            public final java.math.BigDecimal amount = s.getShareAmount();
            public final boolean settled = s.isSettled();
            public final java.time.LocalDateTime createdAt = s.getBill().getCreatedAt();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dto);
    }

    // ✅ Settle (mark paid) a specific share
    @PostMapping("/shares/{id}/settle")
    public ResponseEntity<?> settleShare(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        BillShare settled = billService.settleShare(id, userDetails.getUsername());

        // ✅ return DTO to avoid recursion
        var dto = new Object() {
            public final Long id = settled.getId();
            public final Long billId = settled.getBill().getId();
            public final String description = settled.getBill().getDescription();
            public final String creator = settled.getBill().getCreator().getUsername();
            public final java.math.BigDecimal amount = settled.getShareAmount();
            public final boolean settledStatus = settled.isSettled();
        };

        return ResponseEntity.ok(dto);
    }
}
