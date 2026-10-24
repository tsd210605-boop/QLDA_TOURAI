package tourism_app.packages_service.controller.admin;

import org.springframework.web.bind.annotation.*;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.service.PackageItineraryService;

import java.util.List;

@RestController
@RequestMapping("/admin/packages")
public class AdminPackageItineraryController {

    private final PackageItineraryService itineraryService;

    public AdminPackageItineraryController(PackageItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    // Get all itineraries for a package
    @GetMapping("/{packageId}/itineraries")
    public List<PackageItinerary> getItineraries(@PathVariable Long packageId) {
        return itineraryService.getItineraryByPackage(packageId);
    }

    // Get single itinerary by ID
    @GetMapping("/itinerary/{id}")
    public PackageItinerary getItinerary(@PathVariable Long id) {
        return itineraryService.getItineraryById(id);
    }

    // Create new itinerary
    @PostMapping("/{packageId}/itineraries")
    public PackageItinerary createItinerary(@PathVariable Long packageId,
                                            @RequestBody PackageItinerary itinerary) {
        return itineraryService.createItinerary(packageId, itinerary);
    }

    // Update existing itinerary
    @PutMapping("/itinerary/{id}")
    public PackageItinerary updateItinerary(@PathVariable Long id,
                                            @RequestBody PackageItinerary itinerary) {
        return itineraryService.updateItinerary(id, itinerary);
    }

    // Delete itinerary
    @DeleteMapping("/itinerary/{id}")
    public String deleteItinerary(@PathVariable Long id) {
        itineraryService.deleteItinerary(id);
        return "Itinerary deleted successfully!";
    }
}
