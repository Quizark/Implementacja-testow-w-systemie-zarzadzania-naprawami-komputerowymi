package com.example.springbootmongodb.controller;

import com.example.springbootmongodb.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class SessionManager {

    @Autowired
    private JwtUtil jwtUtil;

    // Weryfikuj token JWT
    public boolean isSessionValid(String sessionToken) {
        Claims claims = jwtUtil.validateToken(sessionToken);
        return claims != null && claims.getExpiration().after(new Date());
    }
    // Pobierz email użytkownika z tokena
    public String getEmailFromToken(String token) {
        Claims claims = jwtUtil.validateToken(token);
        if (claims != null) {
            return claims.getSubject();  // Zwracamy email użytkownika, który jest zapisany jako subject w tokenie
        }
        return null;  // Jeśli token jest nieprawidłowy
    }
}
