package com.springboot.healthcare.service;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.InvocationTargetException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JWTServiceTest {

    private JWTService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JWTService();
        // Set a valid base64-encoded secret key for testing
        jwtService.secretKey = "dGVzdGtleWZvcmp3dHNpbnVuaXR0ZXN0aW5nMTIzNDU2"; // "testkeyforjwtsinunittesting123456"
    }

    @Test
    void testGenerateTokenAndExtractClaims() {
        String token = jwtService.generateToken("johndoe", "PATIENT");
        assertNotNull(token);

        String username = jwtService.extractUserName(token);
        String role = jwtService.extractRole(token);

        assertEquals("johndoe", username);
        assertEquals("PATIENT", role);
    }

    @Test
    void testValidateTokenSuccess() {
        String token = jwtService.generateToken("johndoe", "PATIENT");
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("johndoe");

        boolean isValid = jwtService.validateToken(token, userDetails);
        assertTrue(isValid);
    }

    @Test
    void testValidateTokenWrongUser() {
        String token = jwtService.generateToken("johndoe", "PATIENT");
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("janedoe");

        boolean isValid = jwtService.validateToken(token, userDetails);
        assertFalse(isValid);
    }

    @Test
    void testIsTokenExpired() throws InterruptedException {
        // Generate a token with a short expiration for testing
        jwtService = new JWTService() {
            @Override
            public String generateToken(String username, String role) {
                Map<String, Object> claims = new HashMap<>();
                claims.put("role", role);
                return io.jsonwebtoken.Jwts.builder()
                        .claims()
                        .add(claims)
                        .subject(username)
                        .issuedAt(new java.util.Date(System.currentTimeMillis()))
                        .expiration(new java.util.Date(System.currentTimeMillis() + 100)) // 100ms
                        .and()
                        .signWith(getKey())
                        .compact();
            }
        };
        jwtService.secretKey = "dGVzdGtleWZvcmp3dHNpbnVuaXR0ZXN0aW5nMTIzNDU2";
        String token = jwtService.generateToken("johndoe", "PATIENT");
        Thread.sleep(200); // Wait for token to expire

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("johndoe");

        boolean isValid = jwtService.validateToken(token, userDetails);
        assertFalse(isValid);
    }

    
    @Test
    void testExtractRoleWithNoRoleClaim() {
        // Generate a token without a role claim
        String token = io.jsonwebtoken.Jwts.builder()
                .subject("johndoe")
                .issuedAt(new java.util.Date(System.currentTimeMillis()))
                .expiration(new java.util.Date(System.currentTimeMillis() + 100000))
                .signWith(jwtService.getKey())
                .compact();

        String role = jwtService.extractRole(token);
        assertNull(role);
    }

    @Test
    void testExtractUserNameWithInvalidToken() {
        String invalidToken = "invalid.token.value";
        assertThrows(Exception.class, () -> jwtService.extractUserName(invalidToken));
    }

    @Test
    void testExtractClaimWithCustomClaim() throws NoSuchMethodException, SecurityException, IllegalAccessException, InvocationTargetException {
        // Generate a token with a custom claim
        String token = io.jsonwebtoken.Jwts.builder()
                .claim("custom", "customValue")
                .subject("johndoe")
                .issuedAt(new java.util.Date(System.currentTimeMillis()))
                .expiration(new java.util.Date(System.currentTimeMillis() + 100000))
                .signWith(jwtService.getKey())
                .compact();

        // Use reflection to access private extractClaim method
        java.lang.reflect.Method method = jwtService.getClass().getDeclaredMethod(
                "extractClaim", String.class, java.util.function.Function.class);
        method.setAccessible(true);
        String customValue = (String) method.invoke(jwtService, token, (java.util.function.Function<io.jsonwebtoken.Claims, String>) claims -> claims.get("custom", String.class));
        assertEquals("customValue", customValue);
    }

    @Test
    void testGetKeyReturnsValidSecretKey() {
        javax.crypto.SecretKey key = jwtService.getKey();
        assertNotNull(key);
        assertEquals("HmacSHA256", key.getAlgorithm());
    }

    @Test
    void testExtractAllClaimsWithInvalidTokenThrowsException() throws NoSuchMethodException, SecurityException {
        String invalidToken = "invalid.token.value";
        java.lang.reflect.Method method = jwtService.getClass().getDeclaredMethod("extractAllClaims", String.class);
        method.setAccessible(true);
        assertThrows(Exception.class, () -> method.invoke(jwtService, invalidToken));
    }
}
