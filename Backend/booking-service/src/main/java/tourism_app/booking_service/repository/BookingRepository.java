package tourism_app.booking_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tourism_app.booking_service.model.Booking;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByBookingType(String bookingType);

    List<Booking> findByPackageTitle(String packageTitle);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByPhone(String phone);

    List<Booking> findByStatus(String status);

    List<Booking> findByUserIdAndBookingType(Long userId, String bookingType);
}
