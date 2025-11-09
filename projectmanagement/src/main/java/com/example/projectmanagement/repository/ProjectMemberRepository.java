package com.example.projectmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.ProjectMember;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    
}
