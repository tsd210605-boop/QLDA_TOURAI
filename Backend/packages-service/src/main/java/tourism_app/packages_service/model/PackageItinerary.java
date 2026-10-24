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
    public Long getItineraryId() { return itineraryId; }
    public void setItineraryId(Long itineraryId) { this.itineraryId = itineraryId; }

    public int getDayNumber() { return dayNumber; }
    public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Package getPkg() { return pkg; }
    public void setPkg(Package pkg) { this.pkg = pkg; }
}
