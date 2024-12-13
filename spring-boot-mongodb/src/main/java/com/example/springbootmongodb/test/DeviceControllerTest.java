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

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
        String validSessionToken = getLoginToken();

        Device device = new Device();
        device.setCodeNumber("12345");
        device.setEmail("duplicate@example.com");
        device.setVisibleDamage("None");
        device.setDescription("New laptop");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Device registered successfully");
        response.put("Device", device);

        mockMvc.perform(post("/devices/create")
                        .header("Authorization", validSessionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(device)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Device registered successfully"))
                .andExpect(jsonPath("$.Device.codeNumber").value("12345"));
    }

    @Test
    public void shouldReturnDevicesByEmail() throws Exception {
        String validSessionToken = getLoginToken();
        String email = "duplicate@example.com";

        mockMvc.perform(get("/devices/email/{email}", email)
                        .header("Authorization", validSessionToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
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
