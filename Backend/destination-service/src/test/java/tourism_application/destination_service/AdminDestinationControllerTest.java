package tourism_application.destination_service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tourism_application.destination_service.model.Destination;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminDestinationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    void setUp() {
        adminToken = "Bearer " + JWT.create()
                .withSubject("admin@travelbook.com")
                .withClaim("role", "ADMIN")
                .sign(Algorithm.HMAC256("dev-only-secret-change-me"));
    }

    @Test
    @DisplayName("GET /api/admin/destinations - Should return destinations list")
    void testGetAllDestinations() throws Exception {
        mockMvc.perform(get("/api/admin/destinations")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/admin/destinations - Should create new destination successfully")
    void testCreateDestinationSuccess() throws Exception {
        Destination dest = new Destination();
        dest.setName("Đảo Cù Lao Chàm Test");
        dest.setDescription("Khu dự trữ sinh quyển thế giới với biển xanh trong vắt");
        dest.setLocation("Quảng Nam");
        dest.setCategory("Beach & Relaxation");
        dest.setAvgPrice(30.0);
        dest.setImageUrl("https://example.com/culaocham.jpg");

        MvcResult result = mockMvc.perform(post("/api/admin/destinations")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Đảo Cù Lao Chàm Test"))
                .andExpect(jsonPath("$.location").value("Quảng Nam"))
                .andExpect(jsonPath("$.category").value("Beach & Relaxation"))
                .andReturn();

        Destination created = objectMapper.readValue(result.getResponse().getContentAsString(), Destination.class);
        assertThat(created.getId()).isNotNull();

        // Cleanup
        mockMvc.perform(delete("/api/admin/destinations/" + created.getId())
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/admin/destinations - Should return 400 Bad Request when name is blank")
    void testCreateDestinationMissingNameReturns400() throws Exception {
        Destination invalid = new Destination();
        invalid.setName(""); // blank!
        invalid.setLocation("Hà Nội");
        invalid.setCategory("City Experience");

        mockMvc.perform(post("/api/admin/destinations")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").exists());
    }

    @Test
    @DisplayName("PUT /api/admin/destinations/{id} - Should update destination details")
    void testUpdateDestinationSuccess() throws Exception {
        // 1. Create
        Destination dest = new Destination();
        dest.setName("Điểm Đến Ban Đầu");
        dest.setLocation("Lâm Đồng");
        dest.setCategory("Nature & Adventure");

        MvcResult createRes = mockMvc.perform(post("/api/admin/destinations")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dest)))
                .andExpect(status().isOk())
                .andReturn();

        Destination created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Destination.class);
        Long id = created.getId();

        // 2. Update
        Destination updateData = new Destination();
        updateData.setName("Hồ Tuyền Lâm Đà Lạt Đã Cập Nhật");
        updateData.setLocation("Đà Lạt, Lâm Đồng");
        updateData.setDescription("Hồ nước ngọt lớn nhất Đà Lạt");
        updateData.setCategory("Nature & Adventure");
        updateData.setImageUrl("https://example.com/tuyenlam.jpg");

        mockMvc.perform(put("/api/admin/destinations/" + id)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Hồ Tuyền Lâm Đà Lạt Đã Cập Nhật"))
                .andExpect(jsonPath("$.location").value("Đà Lạt, Lâm Đồng"));

        // 3. Delete
        mockMvc.perform(delete("/api/admin/destinations/" + id)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }
}

