package com.sociallogin.controller;

import com.sociallogin.dto.UserRequestDTO;
import com.sociallogin.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")    // http://localhost:8080/api/auth/**
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public String signUp(@RequestBody UserRequestDTO userRequestDTO) {

        userService.singUp(userRequestDTO);

        return "회원가입 성공";
    }

}
