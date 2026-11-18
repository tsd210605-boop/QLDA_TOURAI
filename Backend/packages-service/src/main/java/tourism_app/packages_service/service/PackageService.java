// Thực hiện các truy vấn catalog tour và xác định các tour liên quan.

package tourism_app.packages_service.service;

import org.springframework.stereotype.Service;
import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.repository.PackageRepository;

import java.util.List;

@Service
public class PackageService {
    private final PackageRepository packageRepository;

    /** Nhận repository dùng để đọc dữ liệu tour. */
    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    /** Đọc toàn bộ tour từ bảng packages. */
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    /** Tìm tour theo khóa chính và báo lỗi nếu ID không có trong dữ liệu. */
    public Package getPackageById(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
    }

    /** Tìm các tour thuộc chuyên mục được yêu cầu. */
    public List<Package> getPackagesByCategory(String category) {
        return packageRepository.findByCategory(category);
    }

    /** Đọc các tour cùng danh mục rồi lọc bỏ tour có ID bằng excludeId. */
    public List<Package> getRelatedPackages(String category, Long excludeId) {
        return packageRepository.findByCategory(category).stream()
                .filter(pkg -> !pkg.getPackageId().equals(excludeId))
                .toList();
    }
}
