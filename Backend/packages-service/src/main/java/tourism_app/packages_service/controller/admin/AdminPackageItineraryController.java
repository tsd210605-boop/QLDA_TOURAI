// Cung cấp API quản trị để liệt kê, xem riêng, thêm, sửa và xóa các ngày lịch trình.

package tourism_app.packages_service.controller.admin;

import org.springframework.web.bind.annotation.*;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.service.PackageItineraryService;

import java.util.List;

@RestController
@RequestMapping("/admin/packages")
public class AdminPackageItineraryController {

    private final PackageItineraryService itineraryService;

    /** Nhận service quản lý lịch trình để ủy quyền truy vấn và kiểm tra dữ liệu. */
    public AdminPackageItineraryController(PackageItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    // Get all itineraries for a package
    /** Lấy packageId trên URL và trả toàn bộ ngày thuộc tour đó qua service. */
    @GetMapping("/{packageId}/itineraries")
    public List<PackageItinerary> getItineraries(@PathVariable Long packageId) {
        return itineraryService.getItineraryByPackage(packageId);
    }

    // Get single itinerary by ID
    /** Lấy một bản ghi ngày theo itineraryId. */
    @GetMapping("/itinerary/{id}")
    public PackageItinerary getItinerary(@PathVariable Long id) {
        return itineraryService.getItineraryById(id);
    }

    // Create new itinerary
    /** Chuyển packageId, số thứ tự ngày và mô tả từ request sang service để thêm ngày cho tour. */
    @PostMapping("/{packageId}/itineraries")
    public PackageItinerary createItinerary(@PathVariable Long packageId,
                                            @RequestBody PackageItinerary itinerary) {
        return itineraryService.createItinerary(packageId, itinerary);
    }

    // Update existing itinerary
    /** Chuyển ID bản ghi và dữ liệu ngày mới cho service để sửa lịch trình của tour hiện có. */
    @PutMapping("/itinerary/{id}")
    public PackageItinerary updateItinerary(@PathVariable Long id,
                                            @RequestBody PackageItinerary itinerary) {
        return itineraryService.updateItinerary(id, itinerary);
    }

    // Delete itinerary
    /** Yêu cầu service xóa bản ghi ngày theo ID rồi trả thông báo xác nhận. */
    @DeleteMapping("/itinerary/{id}")
    public String deleteItinerary(@PathVariable Long id) {
        itineraryService.deleteItinerary(id);
        return "Itinerary deleted successfully!";
    }
}
