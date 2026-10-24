package tourism_app.auth_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import tourism_app.auth_service.model.Role;
import tourism_app.auth_service.model.User;
import tourism_app.auth_service.repository.RoleRepository;
import tourism_app.auth_service.repository.UserRepository;

import java.util.List;

@Configuration
public class AdminUserInitializer {

    record SeedAccount(String email, String password, String name, String roleName, Long roleId, String phone) {}

    @Bean
    CommandLineRunner seedDemoAccounts(UserRepository userRepo, RoleRepository roleRepo, BCryptPasswordEncoder encoder) {
        return args -> {
            List<SeedAccount> demoAccounts = List.of(
                    new SeedAccount("admin@travelbook.com", "admin123", "Quản Trị Viên (Admin)", "ADMIN", 1L, "0901000001"),
                    new SeedAccount("operator@travelbook.com", "operator123", "Điều Hành Tour (Operator)", "OPERATOR", 2L, "0902000002"),
                    new SeedAccount("sales@travelbook.com", "sales123", "Chuyên Viên Kinh Doanh (Sales)", "SALES", 3L, "0903000003"),
                    new SeedAccount("guide@travelbook.com", "guide123", "Hướng Dẫn Viên (Guide)", "GUIDE", 4L, "0904000004"),
                    new SeedAccount("customer@travelbook.com", "customer123", "Khách Hàng Du Lịch (Customer)", "CUSTOMER", 5L, "0905000005")
            );

            for (SeedAccount acc : demoAccounts) {
                userRepo.findByEmail(acc.email()).ifPresentOrElse(
                        existing -> {
                            // Ensure roleId and status are aligned
                            boolean updated = false;
                            if (existing.getRoleId() == null) {
                                existing.setRoleId(acc.roleId());
                                updated = true;
                            }
                            if (existing.getStatus() == null) {
                                existing.setStatus("ACTIVE");
                                updated = true;
                            }
                            if (existing.getRole() == null || existing.getRole().equalsIgnoreCase("USER")) {
                                existing.setRole(acc.roleName());
                                updated = true;
                            }
                            if (updated) {
                                userRepo.save(existing);
                            }
                        },
                        () -> {
                            User newUser = new User();
                            newUser.setEmail(acc.email());
                            newUser.setName(acc.name());
                            newUser.setPhone(acc.phone());
                            newUser.setPasswordHash(encoder.encode(acc.password()));
                            newUser.setRole(acc.roleName());
                            newUser.setRoleId(acc.roleId());
                            newUser.setStatus("ACTIVE");
                            userRepo.save(newUser);
                            System.out.println("Seeded demo RBAC user: " + acc.email() + " [" + acc.roleName() + "]");
                        }
                );
            }
        };
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
