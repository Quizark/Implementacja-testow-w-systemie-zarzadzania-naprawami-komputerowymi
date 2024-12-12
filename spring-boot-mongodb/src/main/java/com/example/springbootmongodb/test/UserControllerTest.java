package com.example.springbootmongodb.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    // Test sprawdzający, czy można zmienić wartość isAdmin na true
    @Test
    public void shouldUpdateUserIsAdminToTrue() throws Exception {
        // Przygotowanie użytkownika do zaktualizowania
        User existingUser = new User();
        existingUser.setEmail("shouldUpdateUserIsAdminToTrue@example.com");
        existingUser.setPassword(DigestUtils.sha256Hex("shouldUpdateUserIsAdminToTrue"));
        existingUser.setIsAdmin(false);
        userRepository.save(existingUser);  // Zapisanie użytkownika w repozytorium

        // Uzyskanie tokenu sesji
        String token = getLoginToken(); // Zakładając, że masz metodę do uzyskiwania tokenu

        // Przygotowanie nowego użytkownika z isAdmin ustawionym na true
        User updatedUser = new User();
        updatedUser.setEmail("test2@example.com");
        updatedUser.setPassword("password");
        updatedUser.setIsAdmin(true);

        // Wykonanie żądania PUT do endpointu aktualizacji użytkownika
        MvcResult result = mockMvc.perform(put("/users/{id}", existingUser.getId())
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andReturn();

        // Sprawdzenie, czy wartość isAdmin została zmieniona na true
        User returnedUser = objectMapper.readValue(result.getResponse().getContentAsString(), User.class);
        assertEquals(true, returnedUser.getIsAdmin()); // Sprawdzamy, czy isAdmin jest równe true
    }

    // Przykładowa metoda do uzyskiwania tokenu z endpointu logowania
    private String getLoginToken() throws Exception {
        User user = new User();
        user.setEmail("shouldUpdateUserIsAdminToTrue@example.com");
        user.setPassword("shouldUpdateUserIsAdminToTrue");

        MvcResult result = mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        return JsonPath.read(result.getResponse().getContentAsString(), "$.sessionToken");
    }
}
