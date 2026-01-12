package com.example.projectmanagement.config;

import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalModelAttributes {

    @Autowired
    private UserService userService;

    @ModelAttribute("username")
    public String username(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String loginId = authentication.getName();
        User user = userService.findByUsername(loginId).orElse(null);
        return (user != null) ? user.getDisplayName() : loginId;
    }
}


