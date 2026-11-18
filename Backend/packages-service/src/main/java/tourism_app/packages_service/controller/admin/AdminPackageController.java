// Cung cấp API CRUD tour cho trang quản trị và thao tác trực tiếp qua PackageRepository.

package tourism_app.packages_service.controller.admin;

import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/packages")
public class AdminPackageController {

    @Autowired
    private PackageRepository packageRepository;

    // GET ALL PACKAGES
    /** Đọc tất cả tour cho bảng quản trị. */
    @GetMapping
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    // GET PACKAGE BY ID
    /** Tìm tour theo ID để form hoặc trang lịch trình tải thông tin tour. */
    @GetMapping("/{id}")
    public Package getPackageById(@PathVariable Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    // ADD PACKAGE
    /** Kiểm tra dữ liệu tour nhận từ JSON, lưu vào bảng packages và trả bản ghi đã lưu. */
    @PostMapping
    public Package addPackage(@Valid @RequestBody Package travelPackage) {
        return packageRepository.save(travelPackage);
    }

    // UPDATE PACKAGE
    /** Tìm tour theo ID rồi cập nhật thông tin chính như danh mục, thời lượng, điểm đến, giá, số khách và ảnh trước khi lưu. */
    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable Long id, @Valid @RequestBody Package updatedPackage) {
        Package travelPackage = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));

        travelPackage.setTitle(updatedPackage.getTitle());
        travelPackage.setCategory(updatedPackage.getCategory());
        travelPackage.setDuration(updatedPackage.getDuration());
        travelPackage.setBestFor(updatedPackage.getBestFor());
        travelPackage.setMainDestinations(updatedPackage.getMainDestinations());
        travelPackage.setPrice(updatedPackage.getPrice());
        travelPackage.setPeopleCount(updatedPackage.getPeopleCount());
        travelPackage.setImageUrl(updatedPackage.getImageUrl());

        return packageRepository.save(travelPackage);
    }

    // DELETE PACKAGE
    /** Xóa tour theo ID qua repository. Quan hệ cascade áp dụng cho các ngày lịch trình thuộc tour. */
    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable Long id) {
        packageRepository.deleteById(id);
    }
}
