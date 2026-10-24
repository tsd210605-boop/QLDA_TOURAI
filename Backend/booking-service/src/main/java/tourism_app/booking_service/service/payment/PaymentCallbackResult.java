package tourism_app.booking_service.service.payment;

import java.math.BigDecimal;

public class PaymentCallbackResult {
    private boolean success;
    private String transactionCode;
    private String responseCode;
    private String message;
    private String bankCode;
    private BigDecimal amount;

    public PaymentCallbackResult(boolean success, String transactionCode, String responseCode, String message, String bankCode, BigDecimal amount) {
        this.success = success;
        this.transactionCode = transactionCode;
        this.responseCode = responseCode;
        this.message = message;
        this.bankCode = bankCode;
        this.amount = amount;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getTransactionCode() { return transactionCode; }
    public void setTransactionCode(String transactionCode) { this.transactionCode = transactionCode; }

    public String getResponseCode() { return responseCode; }
    public void setResponseCode(String responseCode) { this.responseCode = responseCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
