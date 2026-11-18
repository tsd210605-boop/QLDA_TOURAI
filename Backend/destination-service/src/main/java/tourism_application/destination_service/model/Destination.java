// Mô hình JPA của điểm đến, gồm thông tin hiển thị, giá tham khảo và quy tắc kiểm tra dữ liệu bắt buộc.

package tourism_application.destination_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "destinations")
public class Destination
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Destination name cannot be empty")
    private String name;

    @Column(length = 4000)
    private String description;

    @NotBlank(message = "Location cannot be empty")
    private String location;
    
    @NotBlank(message = "Category cannot be empty")
    private String category;
    
    private Double avgPrice;
    private String imageUrl;

    /** Tạo đối tượng điểm đến rỗng để JPA và bộ đọc JSON có thể khởi tạo. */
    public Destination() {}

    // Getters & Setters
    /** Trả về mã điểm đến. */
    public Long getId() { return id; }
    /** Gán mã điểm đến. */
    public void setId(Long id) { this.id = id; }

    /** Trả về tên điểm đến. */
    public String getName() { return name; }
    /** Gán tên điểm đến. */
    public void setName(String name) { this.name = name; }

    /** Trả về nội dung mô tả. */
    public String getDescription() { return description; }
    /** Gán nội dung mô tả. */
    public void setDescription(String description) { this.description = description; }

    /** Trả về địa phương của điểm đến. */
    public String getLocation() { return location; }
    /** Gán địa phương của điểm đến. */
    public void setLocation(String location) { this.location = location; }

    /** Trả về mã danh mục. */
    public String getCategory() { return category; }
    /** Gán mã danh mục. */
    public void setCategory(String category) { this.category = category; }

    /** Trả về giá tham khảo của điểm đến bằng VNĐ. */
    public Double getAvgPrice() { return avgPrice; }
    /** Gán giá tham khảo của điểm đến bằng VNĐ. */
    public void setAvgPrice(Double avgPrice) { this.avgPrice = avgPrice; }

    /** Trả về URL ảnh minh họa. */
    public String getImageUrl() { return imageUrl; }
    /** Gán URL ảnh minh họa. */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
