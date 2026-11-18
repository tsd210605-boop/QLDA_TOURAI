// Xử lý truy vấn điểm đến công khai và cung cấp các hàm ghi dữ liệu điểm đến ở tầng service.

package tourism_application.destination_service.service;

import tourism_application.destination_service.model.Destination;
import tourism_application.destination_service.repository.DestinationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService
{
    private final DestinationRepository repository;

    /** Nhận repository dùng để truy cập bảng destinations. */
    public DestinationService(DestinationRepository repository) {
        this.repository = repository;
    }

    // Get all destinations
    /** Đọc toàn bộ bản ghi điểm đến từ repository. */
    public List<Destination> getAll() {
        return repository.findAll();
    }

    // Get destination by ID
    /** Tìm một điểm đến theo ID và báo lỗi khi không tìm thấy. */
    public Destination getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found: " + id));
    }

    // Get destinations by category
    /** Truy vấn các điểm đến cùng danh mục bằng phép so sánh không phân biệt hoa thường. */
    public List<Destination> getByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }

    // Create new destination
    /** Chuyển bản ghi điểm đến cho repository lưu và trả entity đã lưu. */
    public Destination create(Destination destination) {
        return repository.save(destination);
    }

    // Update existing destination
    /** Tìm bản ghi hiện có rồi cập nhật các thuộc tính từ dữ liệu mới, gồm cả giá tham khảo. */
    public Destination update(Long id, Destination updatedData) {
        Destination existing = getById(id);

        existing.setName(updatedData.getName());
        existing.setDescription(updatedData.getDescription());
        existing.setLocation(updatedData.getLocation());
        existing.setCategory(updatedData.getCategory());
        existing.setAvgPrice(updatedData.getAvgPrice());
        existing.setImageUrl(updatedData.getImageUrl());

        return repository.save(existing);
    }

    // Delete destination
    /** Kiểm tra điểm đến tồn tại trước khi chuyển ID cho repository xóa. */
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete — destination not found: " + id);
        }
        repository.deleteById(id);
    }
}
