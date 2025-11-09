package com.example.projectmanagement.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.projectmanagement.entity.Comment;
import com.example.projectmanagement.entity.Task;
import com.example.projectmanagement.entity.User;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // タスクのコメント一覧（作成日時順）
    List<Comment> findByTaskOrderByCreatedAtDesc(Task task);

    // ユーザーのコメント一覧
    List<Comment> findByUser(User user);

    // タスクのコメント数
    long countByTask(Task task);

    // 最近のコメント（全体）
    @Query("SELECT c FROM Comment c ORDER BY c.createdAt DESC")
    List<Comment> findRecentComments(Pageable pageable);
}