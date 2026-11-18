package tourism_app.packages_service;

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
import tourism_app.packages_service.model.Package;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminPackageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    void setUp() {
        // Generate valid JWT with ADMIN role for full end-to-end security filter test
        adminToken = "Bearer " + JWT.create()
                .withSubject("admin@travelbook.com")
                .withClaim("role", "ADMIN")
                .sign(Algorithm.HMAC256("dev-only-secret-change-me"));
    }

    @Test
    @DisplayName("GET /api/admin/packages - Should return all packages for admin")
    void testGetAllPackages() throws Exception {
        mockMvc.perform(get("/api/admin/packages")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/admin/packages - Should successfully create package with all valid fields")
    void testCreatePackageSuccess() throws Exception {
        Package newPkg = new Package();
        newPkg.setTitle("Tour Khám Phá Vịnh Hạ Long 2N1Đ Test");
        newPkg.setCategory("Nature & Adventure");
        newPkg.setDuration("2 days");
        newPkg.setMainDestinations("Vịnh Hạ Long, Quảng Ninh");
        newPkg.setBestFor("Gia đình, Cặp đôi");
        newPkg.setPrice(150.0);
        newPkg.setPeopleCount(8);
        newPkg.setImageUrl("https://images.unsplash.com/photo-1528127269322-539801943592");

        MvcResult result = mockMvc.perform(post("/api/admin/packages")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newPkg)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.packageId").isNumber())
                .andExpect(jsonPath("$.title").value("Tour Khám Phá Vịnh Hạ Long 2N1Đ Test"))
                .andExpect(jsonPath("$.category").value("Nature & Adventure"))
                .andExpect(jsonPath("$.duration").value("2 days"))
                .andExpect(jsonPath("$.mainDestinations").value("Vịnh Hạ Long, Quảng Ninh"))
                .andExpect(jsonPath("$.price").value(150.0))
                .andExpect(jsonPath("$.peopleCount").value(8))
                .andReturn();

        Package created = objectMapper.readValue(result.getResponse().getContentAsString(), Package.class);
        assertThat(created.getPackageId()).isNotNull();

        // Cleanup test package
        mockMvc.perform(delete("/api/admin/packages/" + created.getPackageId())
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/admin/packages - Should return 400 Bad Request when category is missing")
    void testCreatePackageMissingCategoryReturns400() throws Exception {
        Package invalidPkg = new Package();
        invalidPkg.setTitle("Tour Thiếu Category");
        // Category is null!
        invalidPkg.setDuration("3 days");
        invalidPkg.setMainDestinations("Sapa");
        invalidPkg.setBestFor("Tất cả");
        invalidPkg.setPrice(100.0);
        invalidPkg.setPeopleCount(4);

        mockMvc.perform(post("/api/admin/packages")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPkg)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.category").exists());
    }

    @Test
    @DisplayName("PUT /api/admin/packages/{id} - Should successfully update package title, category and price")
    void testUpdatePackageSuccess() throws Exception {
        // 1. Create initial package
        Package pkg = new Package();
        pkg.setTitle("Tour Ban Đầu");
        pkg.setCategory("City Experience");
        pkg.setDuration("1 day");
        pkg.setMainDestinations("Hà Nội");
        pkg.setBestFor("Khách lẻ");
        pkg.setPrice(50.0);
        pkg.setPeopleCount(2);

        MvcResult createResult = mockMvc.perform(post("/api/admin/packages")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pkg)))
                .andExpect(status().isOk())
                .andReturn();

        Package created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Package.class);
        Long id = created.getPackageId();

        // 2. Update package
        Package updateData = new Package();
        updateData.setTitle("Tour Đã Cập Nhật 2N1Đ");
        updateData.setCategory("Food & Culinary");
        updateData.setDuration("2 days");
        updateData.setMainDestinations("Hà Nội, Phố Cổ");
        updateData.setBestFor("Người sành ăn");
        updateData.setPrice(85.0);
        updateData.setPeopleCount(6);
        updateData.setImageUrl("https://example.com/food.jpg");

        mockMvc.perform(put("/api/admin/packages/" + id)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Tour Đã Cập Nhật 2N1Đ"))
                .andExpect(jsonPath("$.category").value("Food & Culinary"))
                .andExpect(jsonPath("$.price").value(85.0));

        // 3. Delete
        mockMvc.perform(delete("/api/admin/packages/" + id)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }
}
