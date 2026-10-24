package tourism_app.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tourism_app.auth_service.model.Permission;
import tourism_app.auth_service.model.Role;
import tourism_app.auth_service.service.UserService;
import tourism_app.auth_service.util.JwtUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");
        String phone = body.get("phone");

        if (email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "email, password và name là bắt buộc"));
        }

        try {
            Map<String, Object> result = userService.register(email.trim(), password.trim(), name.trim(), phone);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Đăng ký thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ email và mật khẩu"));
        }

        try {
            Map<String, Object> result = userService.login(email.trim(), password.trim());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Đăng nhập thất bại: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Thiếu Bearer Token"));
        }
        String token = authHeader.substring(7);
        return jwtUtil.verifyAndDecode(token)
                .map(jwt -> {
                    String email = jwt.getSubject();
                    try {
                        Map<String, Object> profile = userService.getUserProfile(email);
                        return ResponseEntity.ok(profile);
                    } catch (Exception e) {
                        return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.status(401).body(Map.of("message", "Token không hợp lệ hoặc đã hết hạn")));
    }

    // ==========================================
    // RBAC & User Management Endpoints
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<Map<String, Object>> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String roleName = body.get("role");
        if (roleName == null || roleName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên vai trò (role) không được để trống"));
        }
        try {
            Map<String, Object> updated = userService.updateUserRole(id, roleName.trim());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Trạng thái (status) không được để trống"));
        }
        try {
            Map<String, Object> updated = userService.updateUserStatus(id, status.trim());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }

    @PutMapping("/roles/{id}/permissions")
    public ResponseEntity<?> updateRolePermissions(@PathVariable("id") Long id, @RequestBody Map<String, List<String>> body) {
        List<String> permissions = body.get("permissions");
        if (permissions == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Danh sách quyền (permissions) không được để trống"));
        }
        try {
            Role updated = userService.updateRolePermissions(id, permissions);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(userService.getAllPermissions());
    }
}
