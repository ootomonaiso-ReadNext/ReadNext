package com.example.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String login() {
        return "login";  // login.htmlに対応
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, @AuthenticationPrincipal OAuth2User oauthUser) {
        model.addAttribute("name", oauthUser.getAttribute("name"));
        return "dashboard";  // dashboard.htmlに対応
    }

    @GetMapping("/")
    public String home() {
        return "index";  // index.htmlに対応
    }
}
