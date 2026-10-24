package tourism_app.booking_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tourism_app.booking_service.model.TourDeparture;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourDepartureRepository extends JpaRepository<TourDeparture, Long> {
    Optional<TourDeparture> findByBookingId(Long bookingId);
    List<TourDeparture> findAllByOrderByDepartureDateAsc();
    List<TourDeparture> findByStatus(String status);
}
