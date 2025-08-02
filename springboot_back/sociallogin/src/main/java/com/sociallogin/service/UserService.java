package com.sociallogin.service;

import com.sociallogin.dto.UserRequestDTO;
import com.sociallogin.entity.User;
import com.sociallogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void singUp(UserRequestDTO userRequestDTO) {

        if(userRepository.findByUsername(userRequestDTO.getUsername()).isPresent()) {
            // 이미 존재하는 사용자
            throw new RuntimeException("이미 존재하는 사용자입니다.");
        }

        User user = User.builder()
                .username(userRequestDTO.getUsername())
                .password(passwordEncoder.encode(userRequestDTO.getPassword()))
                .role("ROLE_USER").build();

        userRepository.save(user);
    }
}
