package tourism_app.booking_service.service.payment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tourism_app.booking_service.model.Booking;
import tourism_app.booking_service.model.Invoice;
import tourism_app.booking_service.model.Payment;
import tourism_app.booking_service.model.TourDeparture;
import tourism_app.booking_service.repository.BookingRepository;
import tourism_app.booking_service.repository.InvoiceRepository;
import tourism_app.booking_service.repository.PaymentRepository;
import tourism_app.booking_service.repository.TourDepartureRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    private final Map<String, PaymentGateway> gatewayMap;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final TourDepartureRepository departureRepository;

    public PaymentService(Map<String, PaymentGateway> gatewayMap,
                          BookingRepository bookingRepository,
                          PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          TourDepartureRepository departureRepository) {
        this.gatewayMap = gatewayMap;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.departureRepository = departureRepository;
    }

    @Transactional
    public PaymentInitResponse createPaymentUrl(Long bookingId, String gateway, String ipAddress, String returnUrl) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        String selectedGateway = (gateway != null && !gateway.isBlank()) ? gateway.toUpperCase() : "VNPAY";
        PaymentGateway paymentGateway = gatewayMap.get(selectedGateway);
        if (paymentGateway == null) {
            paymentGateway = gatewayMap.get("VNPAY");
        }

        BigDecimal amount = booking.getTotalPrice() != null ? booking.getTotalPrice() : BigDecimal.valueOf(100);
        PaymentInitResponse initResponse = paymentGateway.createPaymentUrl(booking, amount, ipAddress, returnUrl);

        Payment payment = new Payment();
        payment.setBookingId(booking.getBookingId());
        payment.setTransactionCode(initResponse.getTransactionCode());
        payment.setPaymentGateway(selectedGateway);
        payment.setAmount(amount);
        payment.setStatus("PENDING");
        payment.setPaymentUrl(initResponse.getPaymentUrl());
        paymentRepository.save(payment);

        return initResponse;
    }

    @Transactional
    public PaymentCallbackResult processCallback(String gateway, Map<String, String> params) {
        String selectedGateway = (gateway != null && !gateway.isBlank()) ? gateway.toUpperCase() : "VNPAY";
        PaymentGateway paymentGateway = gatewayMap.get(selectedGateway);
        if (paymentGateway == null) {
            paymentGateway = gatewayMap.get("VNPAY");
        }

        PaymentCallbackResult result = paymentGateway.processCallback(params);

        Optional<Payment> paymentOpt = paymentRepository.findByTransactionCode(result.getTransactionCode());
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setVnpResponseCode(result.getResponseCode());
            payment.setBankCode(result.getBankCode());

            if (result.isSuccess()) {
                payment.setStatus("SUCCESS");
                payment.setPayDate(LocalDateTime.now());

                // Update booking
                Booking booking = bookingRepository.findById(payment.getBookingId()).orElse(null);
                if (booking != null) {
                    booking.setPaymentStatus("PAID");
                    booking.setStatus("CONFIRMED");
                    bookingRepository.save(booking);

                    // Generate Invoice & E-Ticket QR
                    generateInvoice(booking, payment);

                    // Initialize Tour Departure for Operations
                    initializeTourDeparture(booking);
                }
            } else {
                payment.setStatus("FAILED");
            }
            paymentRepository.save(payment);
        }

        return result;
    }

    private void generateInvoice(Booking booking, Payment payment) {
        if (invoiceRepository.findByBookingId(booking.getBookingId()).isEmpty()) {
            Invoice invoice = new Invoice();
            invoice.setInvoiceCode("INV-" + booking.getBookingId() + "-" + System.currentTimeMillis() % 100000);
            invoice.setBookingId(booking.getBookingId());
            invoice.setCustomerName(booking.getName());
            invoice.setCustomerPhone(booking.getPhone());
            invoice.setCustomerEmail(booking.getEmail());
            invoice.setTotalAmount(payment.getAmount());
            invoice.setVatAmount(payment.getAmount().multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP));
            invoice.setIssueDate(LocalDateTime.now());
            invoice.setStatus("ISSUED");
            invoice.setQrCodeData("TICKET:" + booking.getBookingCode() + "|" + booking.getName() + "|" + booking.getPackageTitle() + "|DATE:" + booking.getTravelDate() + "|PAID");
            invoiceRepository.save(invoice);
        }
    }

    private void initializeTourDeparture(Booking booking) {
        if (departureRepository.findByBookingId(booking.getBookingId()).isEmpty()) {
            TourDeparture dep = new TourDeparture();
            dep.setBookingId(booking.getBookingId());
            dep.setPackageTitle(booking.getPackageTitle());
            dep.setDepartureDate(booking.getTravelDate());
            dep.setStatus("PREPARING");
            dep.setNotes("Đoàn tự động khởi tạo sau khi thanh toán thành công mã: " + booking.getBookingCode());
            departureRepository.save(dep);
        }
    }

    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
