package tourism_app.packages_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tourism_app.packages_service.model.PackageOffer;

import java.util.List;

@Repository
public interface PackageOfferRepository extends JpaRepository<PackageOffer, Long> {
    // Get all current offers
    List<PackageOffer> findAll();
}
