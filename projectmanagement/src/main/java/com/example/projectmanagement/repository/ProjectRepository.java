package com.example.projectmanagement.repository;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.entity.Project.ProjectStatus;
import com.example.projectmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // 作成者で検索
    List<Project> findByCreatedBy(User user);

    // ステータスで検索
    List<Project> findByStatus(ProjectStatus status);

    // メンバーが参加しているプロジェクトを検索
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.user = :user")
    List<Project> findByMember(@Param("user") User user);

    // ユーザーが関わる全プロジェクト（作成者 or メンバー）
    @Query("SELECT DISTINCT p FROM Project p " +
        "LEFT JOIN p.members m " + 
        "WHERE p.createdBy = :user OR m.user = :user")
    List<Project> findByUserInvolved(@Param("user") User user);

    // 名前で検索（部分一致）
    List<Project> findByNameContainingIgnoreCase(String name);

    // ステータス別カウント
    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countByStatus();    
}

