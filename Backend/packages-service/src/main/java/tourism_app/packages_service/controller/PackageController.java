package tourism_app.packages_service.controller;

import org.springframework.web.bind.annotation.*;
import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.service.PackageService;
import tourism_app.packages_service.model.PackageOffer;
import tourism_app.packages_service.service.PackageOfferService;

import java.util.List;

@RestController
@RequestMapping("/packages")
public class PackageController {
    private final PackageService packageService;
    private final PackageOfferService offerService;

    public PackageController(PackageService packageService, PackageOfferService offerService) {
        this.packageService = packageService;
        this.offerService = offerService;
    }

    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }

    @GetMapping("/{id}")
    public Package getPackageById(@PathVariable Long id) {
        return packageService.getPackageById(id);
    }

    @GetMapping("/category/{category}")
    public List<Package> getPackagesByCategory(@PathVariable String category) {
        return packageService.getPackagesByCategory(category);
    }

    @GetMapping("/category/{category}/related/{excludeId}")
    public List<Package> getRelatedPackages(@PathVariable String category, @PathVariable Long excludeId) {
        return packageService.getRelatedPackages(category, excludeId);
    }

    // Get all offers
    @GetMapping("/offers")
    public List<PackageOffer> getOffers() {
        return offerService.getAllOffers();
    }
}
