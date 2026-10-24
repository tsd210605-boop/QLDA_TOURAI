package tourism_app.booking_service.dto;

public class DispatchRequest {
    private String tourGuideName;
    private String tourGuidePhone;
    private String vehicleNumber;
    private String driverName;
    private String driverPhone;
    private String status;
    private String notes;

    public String getTourGuideName() { return tourGuideName; }
    public void setTourGuideName(String tourGuideName) { this.tourGuideName = tourGuideName; }

    public String getTourGuidePhone() { return tourGuidePhone; }
    public void setTourGuidePhone(String tourGuidePhone) { this.tourGuidePhone = tourGuidePhone; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
