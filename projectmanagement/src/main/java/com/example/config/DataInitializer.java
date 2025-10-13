package com.example.config;

import com.example.entity.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        // 初期ユーザーが存在しない場合のみ作成
        if (!userService.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@example.com");
            admin.setDisplayName("管理者");
            userService.createUser(admin);
            System.out.println("管理者ユーザーを作成しました: admin / admin123");
        }
        
        if (!userService.existsByUsername("user1")) {
            User user1 = new User();
            user1.setUsername("user1");
            user1.setPassword("user123");
            user1.setEmail("user1@example.com");
            user1.setDisplayName("ユーザー1");
            userService.createUser(user1);
            System.out.println("テストユーザーを作成しました: user1 / user123");
        }
        
        if (!userService.existsByUsername("user2")) {
            User user2 = new User();
            user2.setUsername("user2");
            user2.setPassword("user123");
            user2.setEmail("user2@example.com");
            user2.setDisplayName("ユーザー2");
            userService.createUser(user2);
            System.out.println("テストユーザーを作成しました: user2 / user123");
        }
    }
}
