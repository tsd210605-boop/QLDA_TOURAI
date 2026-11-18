// Cung cấp API lịch trình công khai cho trang chi tiết tour.

package tourism_app.packages_service.controller;

import org.springframework.web.bind.annotation.*;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.service.PackageItineraryService;

import java.util.List;

@RestController
@RequestMapping("/packages")
public class PackageItineraryController {
    private final PackageItineraryService itineraryService;

    /** Nhận service đọc lịch trình theo mã tour. */
    public PackageItineraryController(PackageItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    /** Lấy ID tour từ URL, gọi service để lấy và trả các ngày thuộc tour đó. */
    @GetMapping("/{id}/itinerary")
    public List<PackageItinerary> getItinerary(@PathVariable Long id) {
        return itineraryService.getItineraryByPackage(id);
    }
}
