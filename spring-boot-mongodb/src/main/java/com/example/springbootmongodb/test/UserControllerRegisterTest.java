package com.example.springbootmongodb.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.springbootmongodb.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerRegisterTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldRegisterNewUser() throws Exception {
        User newUser = new User();
        newUser.setEmail("test2@example.com");
        newUser.setPassword("password");
        newUser.setName("John");
        newUser.setSurname("Doe");

        mockMvc.perform(post("/users/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated());
    }

    @Test
    public void shouldNotRegisterExistingUser() throws Exception {
        User existingUser = new User();
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword("password");

        mockMvc.perform(post("/users/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(existingUser)))
                .andExpect(status().isConflict());
    }
    @Test
    public void shouldNotRegisterUserWithBadEmail() throws Exception {
        User invalidUser = new User();
        invalidUser.setEmail("invalid-email-format");
        invalidUser.setPassword("password");

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email format"));
    }
}
