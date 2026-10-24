package tourism_app.booking_service.service.payment;

public class PaymentInitResponse {
    private String paymentUrl;
    private String transactionCode;
    private String gatewayName;
    private Long bookingId;

    public PaymentInitResponse(String paymentUrl, String transactionCode, String gatewayName, Long bookingId) {
        this.paymentUrl = paymentUrl;
        this.transactionCode = transactionCode;
        this.gatewayName = gatewayName;
        this.bookingId = bookingId;
    }

    public String getPaymentUrl() { return paymentUrl; }
    public void setPaymentUrl(String paymentUrl) { this.paymentUrl = paymentUrl; }

    public String getTransactionCode() { return transactionCode; }
    public void setTransactionCode(String transactionCode) { this.transactionCode = transactionCode; }

    public String getGatewayName() { return gatewayName; }
    public void setGatewayName(String gatewayName) { this.gatewayName = gatewayName; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
}
