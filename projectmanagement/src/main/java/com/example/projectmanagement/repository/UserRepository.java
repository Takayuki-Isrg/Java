package com.example.projectmanagement.repository;

import com.example.projectmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * ユーザー名でユーザーを検索
     * @param username ユーザー名
     * @return ユーザー（存在しない場合は空）
     */
    Optional<User> findByUsername(String username);
    
    /**
     * メールアドレスでユーザーを検索
     * @param email メールアドレス
     * @return ユーザー（存在しない場合は空）
     */
    Optional<User> findByEmail(String email);
    
    /**
     * ユーザー名またはメールアドレスでユーザーを検索
     * @param username ユーザー名
     * @param email メールアドレス
     * @return ユーザー（存在しない場合は空）
     */
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    /**
     * ユーザー名が存在するかチェック
     * @param username ユーザー名
     * @return 存在する場合true
     */
    boolean existsByUsername(String username);
    
    /**
     * メールアドレスが存在するかチェック
     * @param email メールアドレス
     * @return 存在する場合true
     */
    boolean existsByEmail(String email);
}

