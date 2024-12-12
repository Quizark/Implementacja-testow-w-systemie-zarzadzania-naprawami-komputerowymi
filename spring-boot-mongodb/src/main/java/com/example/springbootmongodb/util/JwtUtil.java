package com.example.springbootmongodb.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;
//Generuj token
    public String generateToken(String email, String userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 8 * 60 * 60 * 1000)) // 8 godzin
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
    // Weryfikuj token JWT i zwróć dane roszczeń (Claims) jeśli jest poprawny
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (IllegalArgumentException e) {
            return null; // Token jest nieprawidłowy
        }
    }
}
