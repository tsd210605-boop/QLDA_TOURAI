package tourism_app.booking_service.service.payment;

import tourism_app.booking_service.model.Booking;

import java.math.BigDecimal;
import java.util.Map;

public interface PaymentGateway {
    String getGatewayName();

    PaymentInitResponse createPaymentUrl(Booking booking, BigDecimal amount, String ipAddress, String returnUrl);

    PaymentCallbackResult processCallback(Map<String, String> params);
}
