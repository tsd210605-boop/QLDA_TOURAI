package tourism_app.packages_service.service;

import org.springframework.stereotype.Service;
import tourism_app.packages_service.model.PackageOffer;
import tourism_app.packages_service.repository.PackageOfferRepository;

import java.util.List;

@Service
public class PackageOfferService {
    private final PackageOfferRepository offerRepository;

    public PackageOfferService(PackageOfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public List<PackageOffer> getAllOffers() {
        return offerRepository.findAll();
    }
}
