// Cung cấp API công khai để duyệt tour, tìm tour liên quan và lấy danh sách ưu đãi.

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

    /** Nhận service tra cứu tour và service lấy ưu đãi cho các endpoint công khai. */
    public PackageController(PackageService packageService, PackageOfferService offerService) {
        this.packageService = packageService;
        this.offerService = offerService;
    }

    /** Trả danh sách tour để dựng catalog công khai. */
    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }

    /** Dùng ID trên URL để lấy thông tin tour chi tiết qua PackageService. */
    @GetMapping("/{id}")
    public Package getPackageById(@PathVariable Long id) {
        return packageService.getPackageById(id);
    }

    /** Chuyển mã danh mục trên URL cho service và trả các tour phù hợp. */
    @GetMapping("/category/{category}")
    public List<Package> getPackagesByCategory(@PathVariable String category) {
        return packageService.getPackagesByCategory(category);
    }

    /** Tìm tour cùng chuyên mục và loại tour đang xem theo excludeId. */
    @GetMapping("/category/{category}/related/{excludeId}")
    public List<Package> getRelatedPackages(@PathVariable String category, @PathVariable Long excludeId) {
        return packageService.getRelatedPackages(category, excludeId);
    }

    // Get all offers
    /** Trả danh sách ưu đãi từ service cho khu vực hiển thị ưu đãi. */
    @GetMapping("/offers")
    public List<PackageOffer> getOffers() {
        return offerService.getAllOffers();
    }
}
