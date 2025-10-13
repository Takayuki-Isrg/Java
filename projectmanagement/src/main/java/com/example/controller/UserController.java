package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

     @GetMapping("/login")
     public String loginPage() {
         return "user/login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "user/register";
    }
}
