package com.example.projectmanagement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        // ダッシュボード用の統計情報を追加（今後実装予定）
        model.addAttribute("totalProjects", 0);
        model.addAttribute("totalTasks", 0);
        model.addAttribute("completedTasks", 0);
        model.addAttribute("pendingTasks", 0);
        
        return "dashboard";
    }
}

