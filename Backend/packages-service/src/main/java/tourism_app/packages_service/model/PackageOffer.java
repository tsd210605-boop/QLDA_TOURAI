// Mô hình JPA lưu nội dung, phần trăm giảm giá, thời gian áp dụng và hình ảnh của ưu đãi tour.

package tourism_app.packages_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "package_offers")
public class PackageOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long offerId;

    private Long packageId;
    private String offerTitle;
    private Integer discountPercentage;
    private LocalDate startDate;
    private LocalDate endDate;

    private String imageUrl; // optional image for carousel

    // Getters and Setters
    /** Trả về mã ưu đãi. */
    public Long getOfferId() { return offerId; }
    /** Gán mã ưu đãi. */
    public void setOfferId(Long offerId) { this.offerId = offerId; }

    /** Trả về mã tour. */
    public Long getPackageId() { return packageId; }
    /** Gán mã tour. */
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    /** Trả về tiêu đề ưu đãi. */
    public String getOfferTitle() { return offerTitle; }
    /** Gán tiêu đề ưu đãi. */
    public void setOfferTitle(String offerTitle) { this.offerTitle = offerTitle; }

    /** Trả về tỷ lệ giảm giá tính theo phần trăm. */
    public Integer getDiscountPercentage() { return discountPercentage; }
    /** Gán tỷ lệ giảm giá tính theo phần trăm. */
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

    /** Trả về ngày bắt đầu áp dụng ưu đãi. */
    public LocalDate getStartDate() { return startDate; }
    /** Gán ngày bắt đầu áp dụng ưu đãi. */
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    /** Trả về ngày kết thúc áp dụng ưu đãi. */
    public LocalDate getEndDate() { return endDate; }
    /** Gán ngày kết thúc áp dụng ưu đãi. */
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    /** Trả về URL ảnh minh họa. */
    public String getImageUrl() { return imageUrl; }
    /** Gán URL ảnh minh họa. */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
