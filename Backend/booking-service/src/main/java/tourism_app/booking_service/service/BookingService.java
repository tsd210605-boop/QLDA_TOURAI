package tourism_app.booking_service.service;

import org.springframework.stereotype.Service;
import tourism_app.booking_service.dto.BookingRequest;
import tourism_app.booking_service.model.Booking;
import tourism_app.booking_service.repository.BookingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(BookingRequest request) {
        Booking booking = new Booking();

        booking.setUserId(request.getUserId());
        booking.setBookingType(request.getBookingType());
        booking.setPackageTitle(request.getPackageTitle());
        booking.setDestination(request.getDestination());
        booking.setTravelDate(request.getTravelDate());
        booking.setPeople(request.getPeople());
        booking.setDays(request.getDays());
        booking.setTotalPrice(request.getTotalPrice());
        booking.setName(request.getName());
        booking.setPhone(request.getPhone());
        booking.setEmail(request.getEmail());
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setStatus("PENDING");
        booking.setPaymentStatus("UNPAID");
        booking.setBookingCode("BK-" + (System.currentTimeMillis() % 1000000));

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByPhone(String phone) {
        return bookingRepository.findByPhone(phone);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Optional<Booking> getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode);
    }

    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public Booking updateBooking(Long id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setUserId(request.getUserId());
        booking.setBookingType(request.getBookingType());
        booking.setPackageTitle(request.getPackageTitle());
        booking.setDestination(request.getDestination());
        booking.setTravelDate(request.getTravelDate());
        booking.setPeople(request.getPeople());
        booking.setDays(request.getDays());
        booking.setTotalPrice(request.getTotalPrice());
        booking.setName(request.getName());
        booking.setPhone(request.getPhone());
        if (request.getEmail() != null) booking.setEmail(request.getEmail());
        if (request.getSpecialRequests() != null) booking.setSpecialRequests(request.getSpecialRequests());
        if (request.getStatus() != null) booking.setStatus(request.getStatus());
        if (request.getPaymentStatus() != null) booking.setPaymentStatus(request.getPaymentStatus());

        return bookingRepository.save(booking);
    }
}
