package com.politask.config;

import com.politask.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    // Lista de endpoints que NO requieren autenticación
    private final List<String> excludedPaths = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register", 
        "/api/auth/test",
        "/api/users"  // Temporal para testing
    );

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        final String requestPath = request.getRequestURI();
        final String method = request.getMethod();

        // Permitir preflight requests de CORS
        if ("OPTIONS".equals(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Verificar si la ruta está excluida
        boolean isExcluded = excludedPaths.stream()
            .anyMatch(path -> requestPath.startsWith(path));

        if (isExcluded) {
            logger.debug("Skipping JWT validation for excluded path: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
                logger.debug("Extracted email from JWT: " + email);
            } catch (Exception e) {
                logger.error("Error extracting email from JWT: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }
        } else {
            logger.debug("No Authorization header found for path: " + requestPath);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                if (jwtUtil.validateToken(jwt, email)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Successfully authenticated user: " + email);
                } else {
                    logger.debug("JWT token validation failed for user: " + email);
                }
            } catch (Exception e) {
                logger.error("Error authenticating user: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}