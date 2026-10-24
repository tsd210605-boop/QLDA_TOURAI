package tourism_app.packages_service.service;

import org.springframework.stereotype.Service;
import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.repository.PackageRepository;

import java.util.List;

@Service
public class PackageService {
    private final PackageRepository packageRepository;

    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    public Package getPackageById(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
    }

    public List<Package> getPackagesByCategory(String category) {
        return packageRepository.findByCategory(category);
    }

    public List<Package> getRelatedPackages(String category, Long excludeId) {
        return packageRepository.findByCategory(category).stream()
                .filter(pkg -> !pkg.getPackageId().equals(excludeId))
                .toList();
    }
}
