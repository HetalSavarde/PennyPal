package com.pennypal.pennypal.repository;

import com.pennypal.pennypal.model.BillShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillShareRepository extends JpaRepository<BillShare, Long> {
    List<BillShare> findByUser_Username(String username);
    List<BillShare> findByBill_Id(Long billId);
}
