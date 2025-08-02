package com.sociallogin.service;

import com.sociallogin.dto.LoginResponseDTO;
import com.sociallogin.entity.User;
import com.sociallogin.repository.UserRepository;
import com.sociallogin.util.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private  String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    public LoginResponseDTO googleLogin(String code, HttpServletResponse response) {
        // 1. 인가코드로 토큰 요청
        String tokenUrl = "https://oauth2.googleapis.com/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("client_secret", clientSecret);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, tokenRequest, Map.class);
        String googleAccessToken = (String) tokenResponse.getBody().get("access_token");

        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(googleAccessToken);
        HttpEntity<?> userInfoRequest = new HttpEntity<>(userInfoHeaders);

        Map userInfo = restTemplate.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                HttpMethod.GET,
                userInfoRequest,
                Map.class
        ).getBody();

        String email = (String) userInfo.get("email");
        String username = "google_" +userInfo.get("id");

        User user = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    User newUser = new User(username, null, "ROLE_USER");
                    return userRepository.save(newUser);
                });

        String accessToken = jwtTokenProvider.generateAccessToken(username, user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(username);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);
        refreshCookie.setHttpOnly(true);
        response.addCookie(refreshCookie);

        return new LoginResponseDTO(accessToken, null);
    }

}
