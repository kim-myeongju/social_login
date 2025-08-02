package com.sociallogin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;
    @Column(length = 500)
    private String refreshToken;

    public User(String username, String password, String roleUser) {
        this.username = username;
        this.role = roleUser;
        this.password = password;
    }
}
