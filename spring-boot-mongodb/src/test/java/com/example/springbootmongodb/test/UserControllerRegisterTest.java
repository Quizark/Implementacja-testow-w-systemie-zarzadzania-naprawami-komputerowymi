package com.example.springbootmongodb.test;

import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerRegisterTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        // Usuń użytkownika o e-mailu example@example.com, jeśli istnieje
        User existingUser = userRepository.findByEmail("example@example.com");
        if (existingUser != null) {
            userRepository.delete(existingUser);
        }
    }

    @Test
    public void shouldRegisterNewUser() throws Exception {
        // Given
        User newUser = new User();
        newUser.setEmail("example@example.com");
        newUser.setPassword(DigestUtils.sha256Hex("password"));
        newUser.setName("John");
        newUser.setSurname("Doe");

        // When
        mockMvc.perform(post("/users/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(newUser)))
                // Then
                .andExpect(status().isCreated());
    }

    @Test
    public void shouldNotRegisterExistingUser() throws Exception {
        // Given
        User existingUser = new User();
        existingUser.setEmail("example@example.com");
        existingUser.setPassword(DigestUtils.sha256Hex("password"));

        userRepository.save(existingUser); // Upewnij się, że użytkownik istnieje

        // When
        mockMvc.perform(post("/users/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(existingUser)))
                // Then
                .andExpect(status().isConflict());
    }

    @Test
    public void shouldNotRegisterUserWithBadEmail() throws Exception {
        // Given
        User invalidUser = new User();
        invalidUser.setEmail("invalid-email-format");
        invalidUser.setPassword("password");

        // When
        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUser)))
                // Then
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email format"));
    }
}
