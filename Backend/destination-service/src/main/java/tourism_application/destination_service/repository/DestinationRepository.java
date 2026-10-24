package tourism_application.destination_service.repository;

import tourism_application.destination_service.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long>
{
    // Find by category (case-insensitive)
    List<Destination> findByCategoryIgnoreCase(String category);
}
