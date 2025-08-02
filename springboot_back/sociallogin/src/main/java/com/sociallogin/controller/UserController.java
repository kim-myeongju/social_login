package com.sociallogin.controller;

import com.sociallogin.dto.LoginRequestDTO;
import com.sociallogin.dto.LoginResponseDTO;
import com.sociallogin.dto.UserRequestDTO;
import com.sociallogin.entity.User;
import com.sociallogin.repository.UserRepository;
import com.sociallogin.service.GoogleOAuthService;
import com.sociallogin.service.KakaoOAuthService;
import com.sociallogin.service.UserService;
import com.sociallogin.util.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")    // http://localhost:8080/api/auth/**
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final KakaoOAuthService kakaoOAuthService;
    private final GoogleOAuthService googleOAuthService;

    @PostMapping("/signup")
    public String signUp(@RequestBody UserRequestDTO userRequestDTO) {

        userService.singUp(userRequestDTO);

        return "회원가입 성공";
    }

//    @PostMapping("/login")
//    public LoginRequestDTO login(@RequestBody LoginRequestDTO loginRequestDTO) {
//        log.info("getUsername {}", loginRequestDTO.getUsername());
//        return userService.login(loginRequestDTO);
//    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request, HttpServletResponse response) {
        LoginResponseDTO tokens = userService.login(request);

        Cookie refreshCookie = new Cookie("refreshToken", tokens.getRefreshToken());
        refreshCookie.setPath("/");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);      // 7days
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(new LoginResponseDTO(tokens.getAccessToken(), null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        // 쿠키에서 Refresh Token 추출
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 리프레시 토큰입니다.");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        if (!refreshToken.equals(user.getRefreshToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버에 저장된 리프레시 토큰과 다릅니다.");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(username, user.getRole());

        return ResponseEntity.ok(new LoginResponseDTO(newAccessToken, null));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String accessToken, HttpServletResponse response) {
        String token = accessToken.replace("Bearer", "");
        String username = jwtTokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        user.setRefreshToken(null);
        userRepository.save(user);

        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setPath("/");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok("로그아웃 성공");
    }

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String code = body.get("code");
        LoginResponseDTO tokens = kakaoOAuthService.kakaoLogin(code, response);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String code = body.get("code");
        LoginResponseDTO tokens = googleOAuthService.googleLogin(code, response);
        return ResponseEntity.ok(tokens);
    }
}
