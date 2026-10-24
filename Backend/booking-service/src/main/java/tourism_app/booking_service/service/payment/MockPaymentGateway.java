package tourism_app.booking_service.service.payment;

import org.springframework.stereotype.Component;
import tourism_app.booking_service.model.Booking;

import java.math.BigDecimal;
import java.util.Map;

@Component("MOCK")
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public String getGatewayName() {
        return "MOCK";
    }

    @Override
    public PaymentInitResponse createPaymentUrl(Booking booking, BigDecimal amount, String ipAddress, String returnUrl) {
        String txnRef = "MOCK" + booking.getBookingId() + "_" + System.currentTimeMillis();
        String simulatedUrl = (returnUrl != null ? returnUrl : "http://localhost:3000/bookings")
                + "?vnp_ResponseCode=00&vnp_TxnRef=" + txnRef
                + "&vnp_Amount=" + amount.multiply(BigDecimal.valueOf(100)).longValue()
                + "&vnp_BankCode=NCB&mock=true";

        return new PaymentInitResponse(simulatedUrl, txnRef, getGatewayName(), booking.getBookingId());
    }

    @Override
    public PaymentCallbackResult processCallback(Map<String, String> params) {
        String txnRef = params.getOrDefault("vnp_TxnRef", "MOCK_" + System.currentTimeMillis());
        String code = params.getOrDefault("vnp_ResponseCode", "00");
        String bank = params.getOrDefault("vnp_BankCode", "MOCK_BANK");
        boolean success = "00".equals(code);

        String amountStr = params.get("vnp_Amount");
        BigDecimal amount = amountStr != null ? new BigDecimal(amountStr).divide(BigDecimal.valueOf(100)) : BigDecimal.valueOf(100);

        return new PaymentCallbackResult(success, txnRef, code, success ? "Thanh toán giả lập thành công" : "Thanh toán giả lập thất bại", bank, amount);
    }
}
