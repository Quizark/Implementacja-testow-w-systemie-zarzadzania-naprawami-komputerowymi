package com.example.springbootmongodb.test;

import com.example.springbootmongodb.model.Device;
import com.example.springbootmongodb.model.Person;
import com.example.springbootmongodb.model.User;
import com.example.springbootmongodb.repository.DeviceRepository;
import com.example.springbootmongodb.repository.PersonRepository;
import com.example.springbootmongodb.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DeviceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @BeforeEach
    public void setUp() {
        User existingUser = userRepository.findByEmail("tokenAccount@example.com");
        if (existingUser != null) {
            userRepository.delete(existingUser);
        }
        Person existingPerson = personRepository.findByEmail("test@example.com");
        if (existingPerson == null) {
            Person dupPerson = new Person();
            dupPerson.setName("Jane");
            dupPerson.setSurname("Doe");
            dupPerson.setEmail("test@example.com");
            dupPerson.setPhone("123456789");
            personRepository.save(dupPerson);
        }
    }

    @Test
    public void shouldCreateDeviceSuccessfully() throws Exception {
        // Given
        String validSessionToken = getLoginToken();
        Device device = new Device();
        device.setCodeNumber("1234566");
        device.setEmail("test@example.com");
        device.setVisibleDamage("None");
        device.setDescription("New laptop");

        // When
        mockMvc.perform(post("/devices/create")
                        .header("Authorization", validSessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(device)))
                // Then
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Device registered successfully"))
                .andExpect(jsonPath("$.Device.codeNumber").value("1234566"));
    }

    @Test
    public void shouldReturnDevicesByEmail() throws Exception {
        // Given
        Device device = new Device();
        device.setCodeNumber("1234566");
        device.setEmail("device@example.com");
        device.setVisibleDamage("None");
        device.setDescription("New laptop");
        deviceRepository.save(device);

        String validSessionToken = getLoginToken();
        String email = "device@example.com";

        // When
        mockMvc.perform(get("/devices/email/{email}", email)
                        .header("Authorization", validSessionToken))
                // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void shouldReturnDeviceNotFoundWhenDeviceDoesNotExist() throws Exception {
        // Given
        String validSessionToken = getLoginToken();
        String codeNumber = "1234512332";
        String email = "example@example.com";

        // When
        mockMvc.perform(get("/devices/deviceWithDetails")
                        .param("codeNumber", codeNumber)
                        .param("email", email)
                        .header("Authorization", validSessionToken))

                // Then
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").value("Device not found"));
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
