package com.example.springbootmongodb.test;

import com.example.springbootmongodb.model.Person;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.PersonRepository;
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

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        User existingUser = userRepository.findByEmail("tokenAccount@example.com");
        if (existingUser != null) {
            userRepository.delete(existingUser);
        }
        if (!isDataCleared) {
            Person existingPerson = personRepository.findByEmail("first@example.com");
            if (existingPerson != null) {
                personRepository.delete(existingPerson);
            }
            isDataCleared = true;
        }
        Person existingPerson = personRepository.findByEmail("second@example.com");
        if (existingPerson == null) {
            Person createPerson = new Person();
            createPerson.setName("Jane");
            createPerson.setSurname("Doe");
            createPerson.setEmail("second@example.com");
            createPerson.setPhone("123456789");
            personRepository.save(createPerson);
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
        newUser.setEmail("first@example.com");
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
        duplicatePerson.setEmail("second@example.com");
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
