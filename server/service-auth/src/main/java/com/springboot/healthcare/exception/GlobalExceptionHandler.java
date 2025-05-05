package com.springboot.healthcare.exception;

import com.springboot.healthcare.dto.AuthResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public AuthResponse handleUsernameExists(UsernameAlreadyExistsException ex) {
        return new AuthResponse("", "", "", "", ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public AuthResponse handleEmailExists(EmailAlreadyExistsException ex) {
        return new AuthResponse("", "", "", "", ex.getMessage());
    }
}


