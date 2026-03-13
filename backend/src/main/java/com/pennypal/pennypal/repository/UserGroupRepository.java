package com.pennypal.pennypal.repository;

import com.pennypal.pennypal.model.UserGroup;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    List<UserGroup> findByMembers_Username(String username);

}

