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
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; } // NEW
    public void setCategory(String category) { this.category = category; } // NEW

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getBestFor() { return bestFor; }
    public void setBestFor(String bestFor) { this.bestFor = bestFor; }

    public String getMainDestinations() { return mainDestinations; }
    public void setMainDestinations(String mainDestinations) { this.mainDestinations = mainDestinations; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<PackageItinerary> getItinerary() { return itinerary; }
    public void setItinerary(List<PackageItinerary> itinerary) { this.itinerary = itinerary; }
}
