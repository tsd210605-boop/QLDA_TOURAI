// Mô hình JPA của tour và quan hệ với các ngày lịch trình, dùng cho catalog và API quản trị.

package tourism_app.packages_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Entity
@Table(name = "packages")
public class Package
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packageId;

    @NotBlank(message = "Package title cannot be empty")
    private String title;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    @NotBlank(message = "Duration cannot be empty")
    private String duration;
    
    @NotBlank(message = "Best for field cannot be empty")
    private String bestFor;
    
    @NotBlank(message = "Main destinations cannot be empty")
    private String mainDestinations;
    
    @Positive(message = "Price must be greater than 0")
    private Double price;
    
    @Positive(message = "People count must be greater than 0")
    private Integer peopleCount;
    
    private String imageUrl;

    @OneToMany(mappedBy = "pkg", cascade = CascadeType.ALL)
    private List<PackageItinerary> itinerary;

    // Getters and Setters
    /** Trả về mã tour. */
    public Long getPackageId() { return packageId; }
    /** Gán mã tour. */
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    /** Trả về tên tour. */
    public String getTitle() { return title; }
    /** Gán tên tour. */
    public void setTitle(String title) { this.title = title; }

    /** Trả về mã danh mục. */
    public String getCategory() { return category; } // NEW
    /** Gán mã danh mục. */
    public void setCategory(String category) { this.category = category; } // NEW

    /** Trả về thời lượng tour dưới dạng chuỗi. */
    public String getDuration() { return duration; }
    /** Gán thời lượng tour dưới dạng chuỗi. */
    public void setDuration(String duration) { this.duration = duration; }

    /** Trả về nhóm khách phù hợp với tour. */
    public String getBestFor() { return bestFor; }
    /** Gán nhóm khách phù hợp với tour. */
    public void setBestFor(String bestFor) { this.bestFor = bestFor; }

    /** Trả về chuỗi tên và địa phương của điểm đến chính. */
    public String getMainDestinations() { return mainDestinations; }
    /** Gán chuỗi tên và địa phương của điểm đến chính. */
    public void setMainDestinations(String mainDestinations) { this.mainDestinations = mainDestinations; }

    /** Trả về giá tour bằng VNĐ. */
    public Double getPrice() { return price; }
    /** Gán giá tour bằng VNĐ. */
    public void setPrice(Double price) { this.price = price; }

    /** Trả về số khách của tour. */
    public Integer getPeopleCount() { return peopleCount; }
    /** Gán số khách của tour. */
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    /** Trả về URL ảnh minh họa. */
    public String getImageUrl() { return imageUrl; }
    /** Gán URL ảnh minh họa. */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    /** Trả về danh sách các ngày lịch trình. */
    public List<PackageItinerary> getItinerary() { return itinerary; }
    /** Gán danh sách các ngày lịch trình. */
    public void setItinerary(List<PackageItinerary> itinerary) { this.itinerary = itinerary; }
}
