package tourism_app.packages_service.service;

import org.springframework.stereotype.Service;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.repository.PackageItineraryRepository;
import tourism_app.packages_service.repository.PackageRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PackageItineraryService {

    private final PackageItineraryRepository itineraryRepository;
    private final PackageRepository packageRepository;

    public PackageItineraryService(PackageItineraryRepository itineraryRepository,
                                   PackageRepository packageRepository) {
        this.itineraryRepository = itineraryRepository;
        this.packageRepository = packageRepository;
    }

    // Get all itineraries for a package
    public List<PackageItinerary> getItineraryByPackage(Long packageId) {
        return itineraryRepository.findByPkg_PackageId(packageId);
    }

    // Create a new itinerary item
    public PackageItinerary createItinerary(Long packageId, PackageItinerary itinerary) {
        Optional<Package> pkgOpt = packageRepository.findById(packageId);
        if (pkgOpt.isEmpty()) {
            throw new RuntimeException("Package not found with ID: " + packageId);
        }
        itinerary.setPkg(pkgOpt.get());
        return itineraryRepository.save(itinerary);
    }

    // Update an existing itinerary
    public PackageItinerary updateItinerary(Long itineraryId, PackageItinerary updatedItinerary) {
        PackageItinerary existing = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found with ID: " + itineraryId));

        existing.setDayNumber(updatedItinerary.getDayNumber());
        existing.setDescription(updatedItinerary.getDescription());
        return itineraryRepository.save(existing);
    }

    // Delete an itinerary
    public void deleteItinerary(Long itineraryId) {
        if (!itineraryRepository.existsById(itineraryId)) {
            throw new RuntimeException("Itinerary not found with ID: " + itineraryId);
        }
        itineraryRepository.deleteById(itineraryId);
    }

    // Get single itinerary by ID
    public PackageItinerary getItineraryById(Long itineraryId) {
        return itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found with ID: " + itineraryId));
    }
}
