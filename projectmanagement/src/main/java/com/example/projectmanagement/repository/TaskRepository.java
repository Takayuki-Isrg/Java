package com.example.projectmanagement.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.entity.Task;
import com.example.projectmanagement.entity.Task.TaskStatus;
import com.example.projectmanagement.entity.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // プロジェクトで検索
    List<Task> findByProject(Project project);
    
    // プロジェクトとステータスで検索
    List<Task> findByProjectAndStatus(Project project, TaskStatus status);

    // 担当者で検索
    List<Task> findByAssignedUser(User user);

    // 担当者とステータスで検索
    List<Task> findByAssignedUserAndStatus(User user, TaskStatus status);

    // 期限が迫っているタスク
    @Query("SELECT t FROM Task t WHERE t.deadline BETWEEN :start AND :end " 
    + "AND t.status != 'DONE'")
    List<Task> findUpcomingDeadlines(@Param("start") LocalDate start, 
                                      @Param("end") LocalDate end);

    // ステータス別カウント（プロジェクト別）
    @Query("SELECT t.status, COUNT(t) FROM Task t " + 
         "WHERE t.project = :project GROUP BY t.status")
    List<Object[]> countByStatusInProject(@Param("project") Project project);

    // 優先度別カウント
    @Query("SELECT t.priority, COUNT(t) FROM Task t " + 
    "WHERE t.project = :project GROUP BY t.priority")
    List<Object[]> countByPriorityInProject(@Param("project") Project project);
}
