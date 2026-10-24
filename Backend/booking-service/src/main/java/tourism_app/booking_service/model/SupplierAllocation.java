package tourism_app.booking_service.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_supplier_allocations")
public class SupplierAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allocation_id")
    private Long allocationId;

    @Column(name = "departure_id", nullable = false)
    private Long departureId;

    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "service_type", nullable = false)
    private String serviceType; // HOTEL, RESTAURANT, TRANSPORT, TICKET

    @Column(name = "estimated_cost", nullable = false)
    private BigDecimal estimatedCost;

    @Column(name = "voucher_code")
    private String voucherCode;

    @Column(name = "booking_status")
    private String bookingStatus = "REQUESTED"; // REQUESTED, CONFIRMED, PAID, CANCELLED

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.bookingStatus == null) {
            this.bookingStatus = "REQUESTED";
        }
    }

    // Getters and Setters
    public Long getAllocationId() { return allocationId; }
    public void setAllocationId(Long allocationId) { this.allocationId = allocationId; }

    public Long getDepartureId() { return departureId; }
    public void setDepartureId(Long departureId) { this.departureId = departureId; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
