package com.example.springbootmongodb.test;

import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        // Usuń użytkownika o e-mailu example@example.com, jeśli istnieje
        User existingUser = userRepository.findByEmail("tokenAccount@example.com");
        if (existingUser != null) {
            userRepository.delete(existingUser);
        }
    }
    @Test
    public void shouldGetTasksForUserWithValidSession() throws Exception {
        // Given
        String token = getLoginToken();
        String userEmail = "example@example.com";

        // When
        mockMvc.perform(get("/tasks/{email}", userEmail)
                        .header("Authorization", token))
                // Then
                .andExpect(status().isOk());
    }


    private String getLoginToken() throws Exception {
        User existingUser = new User();
        existingUser.setEmail("tokenAccount@example.com");
        existingUser.setPassword(DigestUtils.sha256Hex("tokenAccountPassword"));
        existingUser.setIsAdmin(true);
        existingUser.setIsActive(true);
        userRepository.save(existingUser);

        User user = new User();
        user.setEmail("tokenAccount@example.com");
        user.setPassword("tokenAccountPassword");

        MvcResult result = mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        return JsonPath.read(result.getResponse().getContentAsString(), "$.sessionToken");
    }
}
