package com.politask.controller;

import com.politask.dto.AuthResponse;
import com.politask.dto.LoginRequest;
import com.politask.dto.RegisterRequest;
import com.politask.entity.User;
import com.politask.repository.UserRepository;
import com.politask.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        // Validar errores de validación
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        // Verificar si el email ya existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("email", "El email ya está registrado");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        try {
            // Crear nuevo usuario
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

            User savedUser = userRepository.save(user);

            // Generar token JWT
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());

            // Crear respuesta
            AuthResponse response = new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, BindingResult bindingResult) {
        // Validar errores de validación
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Verificar contraseña con BCrypt
                if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                    // Generar token JWT
                    String token = jwtUtil.generateToken(user.getEmail(), user.getId());
                    
                    // Crear respuesta
                    AuthResponse response = new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
                    
                    return ResponseEntity.ok(response);
                }
            }

            // Credenciales inválidas
            Map<String, String> error = new HashMap<>();
            error.put("message", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Auth endpoint is working!");
        return ResponseEntity.ok(response);
    }
}