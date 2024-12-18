package com.example.springbootmongodb.test;

import com.example.springbootmongodb.model.Person;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.PersonRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PersonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PersonRepository personRepository;

    private static boolean isDataCleared = false;

    @BeforeEach
    public void setUp() {
        if (!isDataCleared) {
            Person existingPerson = personRepository.findByEmail("duplicate@example.com");
            if (existingPerson != null) {
                personRepository.delete(existingPerson);
            }
            isDataCleared = true;
        }
    }

    @Test
    public void shouldGetAllPersonsWhenSessionIsValid() throws Exception {
        // Given
        String validSessionToken = getLoginToken();

        // When
        mockMvc.perform(get("/persons")
                        .header("Authorization", validSessionToken))
                // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
    @Test
    public void shouldCreateNewUser() throws Exception {
        // Given
        String validSessionToken = getLoginToken(); // Pobiera ważny token sesji
        Person newUser = new Person();
        newUser.setName("Jane");
        newUser.setSurname("Doe");
        newUser.setEmail("duplicate@example.com");
        newUser.setPhone("123456789");

        // When
        mockMvc.perform(post("/persons/create")
                        .header("Authorization", validSessionToken) // Dodanie tokena sesji
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                // Then
                .andExpect(status().isCreated());
    }
    @Test
    public void shouldNotCreatePersonWithDuplicateEmail() throws Exception {
        // Given
        String validSessionToken = getLoginToken();
        Person duplicatePerson = new Person();
        duplicatePerson.setName("Jane");
        duplicatePerson.setSurname("Doe");
        duplicatePerson.setEmail("duplicate@example.com");
        duplicatePerson.setPhone("123456789");

        // When
        mockMvc.perform(post("/persons/create")
                        .header("Authorization", validSessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicatePerson)))
                // Then
                .andExpect(status().isConflict())
                .andExpect(content().string("Email already in use"));
    }


    private String getLoginToken() throws Exception {
        User user = new User();
        user.setEmail("example@example.com");
        user.setPassword("password");

        MvcResult result = mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        return JsonPath.read(result.getResponse().getContentAsString(), "$.sessionToken");
    }
}
