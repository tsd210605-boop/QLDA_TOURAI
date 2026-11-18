// Đọc danh sách ưu đãi tour cho API công khai.

package tourism_app.packages_service.service;

import org.springframework.stereotype.Service;
import tourism_app.packages_service.model.PackageOffer;
import tourism_app.packages_service.repository.PackageOfferRepository;

import java.util.List;

@Service
public class PackageOfferService {
    private final PackageOfferRepository offerRepository;

    /** Nhận repository dùng để truy cập bảng package_offers. */
    public PackageOfferService(PackageOfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    /** Đọc toàn bộ ưu đãi hiện có trong bảng mà không lọc theo ngày hiệu lực. */
    public List<PackageOffer> getAllOffers() {
        return offerRepository.findAll();
    }
}
