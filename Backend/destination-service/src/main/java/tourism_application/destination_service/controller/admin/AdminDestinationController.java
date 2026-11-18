// Cung cấp API quản trị điểm đến và gọi trực tiếp DestinationRepository để đọc hoặc ghi dữ liệu.

package tourism_application.destination_service.controller.admin;

import tourism_application.destination_service.model.Destination;
import tourism_application.destination_service.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/destinations")
public class AdminDestinationController {

    @Autowired
    private DestinationRepository destinationRepository;

    // GET ALL DESTINATIONS
    /** Đọc tất cả điểm đến để dựng bảng quản trị và ô chọn điểm đến trên form tour. */
    @GetMapping
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    // GET DESTINATION BY ID
    /** Lấy điểm đến theo ID để điền form sửa. Phát sinh lỗi khi không tìm thấy. */
    @GetMapping("/{id}")
    public Destination getDestinationById(@PathVariable Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
    }

    // ADD DESTINATION
    /** Kiểm tra các trường bắt buộc từ JSON, lưu điểm đến và trả bản ghi đã lưu. */
    @PostMapping
    public Destination addDestination(@Valid @RequestBody Destination destination) {
        return destinationRepository.save(destination);
    }

    // UPDATE DESTINATION
    /** Tìm theo ID trong URL, chép tên, mô tả, địa phương, danh mục và ảnh từ body rồi lưu. Giữ giá tham khảo hiện có. */
    @PutMapping("/{id}")
    public Destination updateDestination(@PathVariable Long id, @Valid @RequestBody Destination updatedDestination) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destination.setName(updatedDestination.getName());
        destination.setDescription(updatedDestination.getDescription());
        destination.setLocation(updatedDestination.getLocation());
        destination.setCategory(updatedDestination.getCategory());
        destination.setImageUrl(updatedDestination.getImageUrl());

        return destinationRepository.save(destination);
    }

    // DELETE DESTINATION
    /** Yêu cầu repository xóa điểm đến theo ID trong URL. Response thành công có thân rỗng. */
    @DeleteMapping("/{id}")
    public void deleteDestination(@PathVariable Long id) {
        destinationRepository.deleteById(id);
    }
}
