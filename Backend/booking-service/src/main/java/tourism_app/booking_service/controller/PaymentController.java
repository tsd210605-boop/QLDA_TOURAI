package tourism_app.booking_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tourism_app.booking_service.model.Payment;
import tourism_app.booking_service.service.payment.PaymentCallbackResult;
import tourism_app.booking_service.service.payment.PaymentInitResponse;
import tourism_app.booking_service.service.payment.PaymentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public static class CreatePaymentRequest {
        private Long bookingId;
        private String gateway; // VNPAY, MOMO, MOCK
        private String returnUrl;

        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public String getGateway() { return gateway; }
        public void setGateway(String gateway) { this.gateway = gateway; }

        public String getReturnUrl() { return returnUrl; }
        public void setReturnUrl(String returnUrl) { this.returnUrl = returnUrl; }
    }

    @PostMapping("/create-url")
    public ResponseEntity<PaymentInitResponse> createPaymentUrl(@RequestBody CreatePaymentRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = httpRequest.getRemoteAddr();
        }
        PaymentInitResponse response = paymentService.createPaymentUrl(
                request.getBookingId(),
                request.getGateway(),
                clientIp,
                request.getReturnUrl()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<PaymentCallbackResult> handleVnPayReturn(@RequestParam Map<String, String> allParams) {
        PaymentCallbackResult result = paymentService.processCallback("VNPAY", allParams);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> handleVnPayIpn(@RequestParam Map<String, String> allParams) {
        PaymentCallbackResult result = paymentService.processCallback("VNPAY", allParams);
        Map<String, String> ipnResponse = new HashMap<>();
        if (result.isSuccess()) {
            ipnResponse.put("RspCode", "00");
            ipnResponse.put("Message", "Confirm Success");
        } else {
            ipnResponse.put("RspCode", "99");
            ipnResponse.put("Message", "Confirm Fail");
        }
        return ResponseEntity.ok(ipnResponse);
    }

    @PostMapping("/callback/{gateway}")
    public ResponseEntity<PaymentCallbackResult> handleGenericCallback(
            @PathVariable String gateway,
            @RequestBody Map<String, String> params) {
        PaymentCallbackResult result = paymentService.processCallback(gateway, params);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBookingId(bookingId));
    }
}
