package com.example.springbootmongodb.test;

import com.example.springbootmongodb.model.Device;
import com.example.springbootmongodb.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
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
public class DeviceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldCreateDeviceSuccessfully() throws Exception {
        // Given
        String validSessionToken = getLoginToken();
        Device device = new Device();
        device.setCodeNumber("1234566");
        device.setEmail("duplicate@example.com");
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
        String validSessionToken = getLoginToken();
        String email = "duplicate@example.com";

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
        String codeNumber = "12345123";
        String email = "example@example.com";

        // When
        mockMvc.perform(get("/devices/deviceWithDetails")
                        .param("codeNumber", codeNumber)
                        .param("email", email))

                // Then
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").value("Device not found"));
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
