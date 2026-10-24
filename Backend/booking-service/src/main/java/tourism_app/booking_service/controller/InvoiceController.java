package tourism_app.booking_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tourism_app.booking_service.model.Invoice;
import tourism_app.booking_service.repository.InvoiceRepository;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Invoice> getInvoiceByBookingId(@PathVariable Long bookingId) {
        return invoiceRepository.findByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{invoiceCode}")
    public ResponseEntity<Invoice> getInvoiceByCode(@PathVariable String invoiceCode) {
        return invoiceRepository.findByInvoiceCode(invoiceCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
