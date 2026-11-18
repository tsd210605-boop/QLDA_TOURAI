// Mô hình JPA của một ngày lịch trình, liên kết với tour cha qua package_id.

package tourism_app.packages_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "package_itinerary")
public class PackageItinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itineraryId;

    private int dayNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "package_id")
    @JsonIgnore //not read through api requests
    private Package pkg;

    // getters and setters
    /** Trả về mã bản ghi ngày lịch trình. */
    public Long getItineraryId() { return itineraryId; }
    /** Gán mã bản ghi ngày lịch trình. */
    public void setItineraryId(Long itineraryId) { this.itineraryId = itineraryId; }

    /** Trả về số thứ tự ngày trong tour. */
    public int getDayNumber() { return dayNumber; }
    /** Gán số thứ tự ngày trong tour. */
    public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

    /** Trả về nội dung mô tả. */
    public String getDescription() { return description; }
    /** Gán nội dung mô tả. */
    public void setDescription(String description) { this.description = description; }

    /** Trả về tour cha của ngày lịch trình. */
    public Package getPkg() { return pkg; }
    /** Gán tour cha của ngày lịch trình. */
    public void setPkg(Package pkg) { this.pkg = pkg; }
}
