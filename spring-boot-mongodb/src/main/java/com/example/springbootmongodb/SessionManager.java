package com.example.springbootmongodb;

import com.example.springbootmongodb.JwtUtil;
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
}
