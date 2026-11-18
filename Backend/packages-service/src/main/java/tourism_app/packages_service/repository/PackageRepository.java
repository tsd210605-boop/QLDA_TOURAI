// Cung cấp thao tác JPA trên bảng packages và truy vấn theo chuyên mục.

package tourism_app.packages_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tourism_app.packages_service.model.Package;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    // Find all packages in a specific category
    /** Đọc các tour có category khớp giá trị dùng trên bộ lọc. */
    List<Package> findByCategory(String category);
}
