package com.realm.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF for H2 Console and API endpoints
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(toH2Console())
                        .ignoringRequestMatchers("/api/auth/**"))
                // 2. Update Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(toH2Console()).permitAll() // Allow all requests to H2 console
                        .requestMatchers("/api/auth/**").permitAll() // Allow access to auth endpoints
                        .anyRequest().authenticated() // Secure all other endpoints
                )
                // 3. Allow Frames for H2 Console
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }
}