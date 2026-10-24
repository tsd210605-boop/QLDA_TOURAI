package tourism_app.packages_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tourism_app.packages_service.model.PackageItinerary;

import java.util.List;

@Repository
public interface PackageItineraryRepository extends JpaRepository<PackageItinerary, Long> {
    // Fetch all itinerary items for a specific package
    List<PackageItinerary> findByPkg_PackageId(Long packageId);
}
