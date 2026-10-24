package tourism_app.booking_service.controller;

import org.springframework.web.bind.annotation.*;
import tourism_app.booking_service.dto.BookingRequest;
import tourism_app.booking_service.model.Booking;
import tourism_app.booking_service.service.BookingService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/phone/{phone}")
    public List<Booking> getBookingsByPhone(@PathVariable String phone) {
        return bookingService.getBookingsByPhone(phone);
    }

    @GetMapping("/code/{bookingCode}")
    public Booking getBookingByCode(@PathVariable String bookingCode) {
        return bookingService.getBookingByCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found with code: " + bookingCode));
    }

    @GetMapping("/{id}")
    public BookingRequest getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusBody) {
        String status = statusBody.get("status");
        return bookingService.updateBookingStatus(id, status);
    }

    private BookingRequest mapToDto(Booking booking) {
        BookingRequest dto = new BookingRequest();
        dto.setBookingId(booking.getBookingId());
        dto.setBookingCode(booking.getBookingCode());
        dto.setBookingType(booking.getBookingType());
        dto.setPackageTitle(booking.getPackageTitle());
        dto.setDestination(booking.getDestination());
        dto.setTravelDate(booking.getTravelDate());
        dto.setDays(booking.getDays());
        dto.setPeople(booking.getPeople());
        dto.setName(booking.getName());
        dto.setPhone(booking.getPhone());
        dto.setEmail(booking.getEmail());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setUserId(booking.getUserId());
        return dto;
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequest request) {
        return bookingService.updateBooking(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
}
