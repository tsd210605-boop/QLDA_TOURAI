package tourism_app.auth_service.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tourism_app.auth_service.model.Permission;
import tourism_app.auth_service.model.Role;
import tourism_app.auth_service.model.User;
import tourism_app.auth_service.repository.PermissionRepository;
import tourism_app.auth_service.repository.RoleRepository;
import tourism_app.auth_service.repository.UserRepository;
import tourism_app.auth_service.util.JwtUtil;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PermissionRepository permissionRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác");
        }

        if ("BLOCKED".equalsIgnoreCase(user.getStatus()) || "INACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalStateException("Tài khoản đã bị tạm khóa hoặc ngừng hoạt động. Vui lòng liên hệ quản trị viên.");
        }

        List<String> permissions = getUserPermissionNames(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId(), user.getName(), permissions);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("email", user.getEmail());
        result.put("name", user.getName());
        result.put("role", user.getRole());
        result.put("status", user.getStatus());
        result.put("permissions", permissions);
        return result;
    }

    public Map<String, Object> register(String email, String password, String name, String phone) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng trong hệ thống");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER").orElse(null);

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("CUSTOMER");
        if (customerRole != null) {
            user.setRoleId(customerRole.getRoleId());
        }
        user.setStatus("ACTIVE");

        User saved = userRepository.save(user);
        List<String> permissions = getUserPermissionNames(saved);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole(), saved.getId(), saved.getName(), permissions);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("userId", saved.getId());
        result.put("email", saved.getEmail());
        result.put("name", saved.getName());
        result.put("role", saved.getRole());
        result.put("status", saved.getStatus());
        result.put("permissions", permissions);
        return result;
    }

    public Map<String, Object> getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));

        List<String> permissions = getUserPermissionNames(user);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("userId", user.getId());
        result.put("email", user.getEmail());
        result.put("name", user.getName());
        result.put("phone", user.getPhone());
        result.put("role", user.getRole());
        result.put("roleId", user.getRoleId());
        result.put("status", user.getStatus());
        result.put("createdAt", user.getCreatedAt());
        result.put("permissions", permissions);
        return result;
    }

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("userId", u.getId());
            m.put("email", u.getEmail());
            m.put("name", u.getName());
            m.put("phone", u.getPhone());
            m.put("role", u.getRole());
            m.put("roleId", u.getRoleId());
            m.put("status", u.getStatus() != null ? u.getStatus() : "ACTIVE");
            m.put("createdAt", u.getCreatedAt());
            m.put("permissions", getUserPermissionNames(u));
            return m;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Vai trò không hợp lệ: " + roleName));

        user.setRole(role.getName());
        user.setRoleId(role.getRoleId());
        User saved = userRepository.save(user);

        return getUserProfile(saved.getEmail());
    }

    @Transactional
    public Map<String, Object> updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        String normalized = status.toUpperCase();
        if (!List.of("ACTIVE", "BLOCKED", "INACTIVE").contains(normalized)) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }

        user.setStatus(normalized);
        User saved = userRepository.save(user);

        return getUserProfile(saved.getEmail());
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @Transactional
    public Role updateRolePermissions(Long roleId, List<String> permissionNames) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + roleId));

        Set<Permission> newPermissions = new HashSet<>();
        for (String permName : permissionNames) {
            permissionRepository.findByName(permName.trim().toUpperCase())
                    .ifPresent(newPermissions::add);
        }

        role.setPermissions(newPermissions);
        return roleRepository.save(role);
    }

    public List<String> getUserPermissionNames(User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            // ADMIN has all permissions
            return permissionRepository.findAll().stream()
                    .map(Permission::getName)
                    .collect(Collectors.toList());
        }

        // Try lookup by roleId or by role name
        Optional<Role> roleOpt = Optional.empty();
        if (user.getRoleId() != null) {
            roleOpt = roleRepository.findById(user.getRoleId());
        }
        if (roleOpt.isEmpty() && user.getRole() != null) {
            roleOpt = roleRepository.findByName(user.getRole().toUpperCase());
        }

        return roleOpt.map(r -> r.getPermissions().stream()
                        .map(Permission::getName)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
}
