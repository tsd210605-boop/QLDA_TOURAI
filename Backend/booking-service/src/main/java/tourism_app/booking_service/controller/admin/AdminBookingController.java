package tourism_app.booking_service.controller.admin;

import tourism_app.booking_service.model.Booking;
import tourism_app.booking_service.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
public class AdminBookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // GET ALL BOOKINGS
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // GET BOOKING BY ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // UPDATE BOOKING
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @Valid @RequestBody Booking updatedBooking) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setName(updatedBooking.getName());
        booking.setPhone(updatedBooking.getPhone());
        booking.setDestination(updatedBooking.getDestination());
        booking.setTravelDate(updatedBooking.getTravelDate());
        booking.setPeople(updatedBooking.getPeople());
        booking.setDays(updatedBooking.getDays());
        booking.setTotalPrice(updatedBooking.getTotalPrice());
        booking.setBookingType(updatedBooking.getBookingType());
        booking.setPackageTitle(updatedBooking.getPackageTitle());

        return bookingRepository.save(booking);
    }

    // DELETE BOOKING
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }
}
