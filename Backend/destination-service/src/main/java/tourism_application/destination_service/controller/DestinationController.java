// Cung cấp API công khai để xem danh sách, tra chi tiết và nhóm điểm đến theo danh mục.

package tourism_application.destination_service.controller;

import tourism_application.destination_service.model.Destination;
import tourism_application.destination_service.service.DestinationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController
{
    private final DestinationService service;

    /** Nhận DestinationService để thực hiện các truy vấn điểm đến công khai. */
    public DestinationController(DestinationService service) {
        this.service = service;
    }

    // Get all destinations
    /** Nhờ service đọc toàn bộ điểm đến và trả mảng JSON cho client. */
    @GetMapping
    public ResponseEntity<List<Destination>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Get destination by ID
    /** Lấy mã từ URL, tìm điểm đến qua service và trả thông tin chi tiết. */
    @GetMapping("/{id}")
    public ResponseEntity<Destination> getById(@PathVariable Long id) {
        Destination destination = service.getById(id);
        return ResponseEntity.ok(destination);
    }

    // Get destinations by category
    /** Lấy tên danh mục từ URL và trả những điểm đến thuộc danh mục đó. */
    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<Destination>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getByCategory(category));
    }

    // Get all destinations grouped by category
    /** Lấy toàn bộ điểm đến rồi nhóm theo category. Dùng khóa Uncategorized cho bản ghi có category null. */
    @GetMapping("/by-categories")
    public ResponseEntity<Map<String, List<Destination>>> getByCategories() {
        List<Destination> all = service.getAll();
        Map<String, List<Destination>> grouped = all.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getCategory() != null ? d.getCategory() : "Uncategorized"
                ));
        return ResponseEntity.ok(grouped);
    }
}
