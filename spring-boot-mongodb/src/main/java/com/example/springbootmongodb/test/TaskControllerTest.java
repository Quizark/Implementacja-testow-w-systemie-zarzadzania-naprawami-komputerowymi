package com.example.springbootmongodb.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    @Test
    public void shouldGetTasksForUserWithValidSession() throws Exception {

        String token = getLoginToken();

        String userEmail = "test@example.com";

        // Wykonaj GET, aby pobrać zadania dla użytkownika
        mockMvc.perform(get("/tasks/{email}", userEmail)
                        .header("Authorization", token)) // Dodanie nagłówka autoryzacji
                .andExpect(status().isOk()); // Oczekuj statusu 200 OK
    }

    // Przykładowa metoda do uzyskiwania tokenu z endpointu logowania
    private String getLoginToken() throws Exception {
        User user = new User();
        user.setEmail("test@test.test");
        user.setPassword("!1Password");

        MvcResult result = mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        return JsonPath.read(result.getResponse().getContentAsString(), "$.sessionToken");
    }
}