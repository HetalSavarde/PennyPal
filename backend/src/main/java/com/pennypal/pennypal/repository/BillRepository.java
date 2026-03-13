package com.pennypal.pennypal.repository;

import com.pennypal.pennypal.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByCreator_Username(String username);
    List<Bill> findByGroup_Id(Long groupId);
}

