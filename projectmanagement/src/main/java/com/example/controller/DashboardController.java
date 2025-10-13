package com.example.controller;

import com.example.entity.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        // 現在のユーザー情報を取得
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            User user = userService.findByUsername(username).orElse(null);
            
            if (user != null) {
                model.addAttribute("user", user);
                model.addAttribute("username", user.getDisplayName());
            } else {
                model.addAttribute("username", username);
            }
        }
        
        // ダッシュボード用の統計情報を追加（今後実装予定）
        model.addAttribute("totalProjects", 0);
        model.addAttribute("totalTasks", 0);
        model.addAttribute("completedTasks", 0);
        model.addAttribute("pendingTasks", 0);
        
        return "dashboard";
    }
}
