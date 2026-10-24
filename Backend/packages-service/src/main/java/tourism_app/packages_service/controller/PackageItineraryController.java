package tourism_app.packages_service.controller;

import org.springframework.web.bind.annotation.*;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.service.PackageItineraryService;

import java.util.List;

@RestController
@RequestMapping("/packages")
public class PackageItineraryController {
    private final PackageItineraryService itineraryService;

    public PackageItineraryController(PackageItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @GetMapping("/{id}/itinerary")
    public List<PackageItinerary> getItinerary(@PathVariable Long id) {
        return itineraryService.getItineraryByPackage(id);
    }
}
