package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.service.ProjectService;
import com.example.projectmanagement.service.UserService;

@Controller
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public String listProjects(Model model, Authentication authentication) {
        // プロジェクト一覧
        List<Project> projects = projectService.findAll();
        model.addAttribute("projects", projects);
        return "project/list";
    }

    @GetMapping("/new")
    public String createProjectForm(Model model, Authentication authentication) {
        model.addAttribute("project", new Project());
        
        return "project/create";
    }

    @PostMapping
    public String saveProject(@ModelAttribute Project project, Authentication authentication) {
        // 作成者を設定
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            com.example.projectmanagement.entity.User user = userService.findByUsername(username).orElse(null);
            project.setCreatedBy(user);
        }
        
        projectService.save(project);
        return "redirect:/dashboard";
    }
}

