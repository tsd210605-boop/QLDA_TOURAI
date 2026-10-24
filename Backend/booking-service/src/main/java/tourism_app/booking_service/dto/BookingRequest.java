package tourism_app.booking_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingRequest {

    private Long bookingId;
    private String bookingCode;
    private Long userId;
    private String bookingType;
    
    @NotBlank(message = "Package title cannot be empty")
    private String packageTitle;
    
    @NotBlank(message = "Destination cannot be empty")
    private String destination;
    
    @NotNull(message = "Travel date is required")
    private LocalDate travelDate;
    
    @NotNull(message = "Number of people is required")
    @Positive(message = "Number of people must be greater than 0")
    private Integer people;
    
    @NotNull(message = "Number of days is required")
    @Positive(message = "Number of days must be greater than 0")
    private Integer days;
    
    @NotNull(message = "Total price is required")
    @Positive(message = "Total price must be greater than 0")
    private BigDecimal totalPrice;
    
    private String status;
    private String paymentStatus;

    @NotBlank(message = "Contact name cannot be empty")
    private String name;
    
    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    private String email;
    private String specialRequests;

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }

    public String getPackageTitle() { return packageTitle; }
    public void setPackageTitle(String packageTitle) { this.packageTitle = packageTitle; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public Integer getPeople() { return people; }
    public void setPeople(Integer people) { this.people = people; }

    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
}
