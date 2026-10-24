package tourism_app.packages_service.controller.admin;

import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/packages")
public class AdminPackageController {

    @Autowired
    private PackageRepository packageRepository;

    // GET ALL PACKAGES
    @GetMapping
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    // GET PACKAGE BY ID
    @GetMapping("/{id}")
    public Package getPackageById(@PathVariable Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    // ADD PACKAGE
    @PostMapping
    public Package addPackage(@Valid @RequestBody Package travelPackage) {
        return packageRepository.save(travelPackage);
    }

    // UPDATE PACKAGE
    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable Long id, @Valid @RequestBody Package updatedPackage) {
        Package travelPackage = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        travelPackage.setTitle(updatedPackage.getTitle());
        travelPackage.setDuration(updatedPackage.getDuration());
        travelPackage.setBestFor(updatedPackage.getBestFor());
        travelPackage.setMainDestinations(updatedPackage.getMainDestinations());
        travelPackage.setPrice(updatedPackage.getPrice());
        travelPackage.setPeopleCount(updatedPackage.getPeopleCount());
        travelPackage.setImageUrl(updatedPackage.getImageUrl());

        return packageRepository.save(travelPackage);
    }

    // DELETE PACKAGE
    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable Long id) {
        packageRepository.deleteById(id);
    }
}
