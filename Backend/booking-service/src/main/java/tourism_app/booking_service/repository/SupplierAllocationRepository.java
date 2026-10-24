package tourism_app.booking_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tourism_app.booking_service.model.SupplierAllocation;

import java.util.List;

@Repository
public interface SupplierAllocationRepository extends JpaRepository<SupplierAllocation, Long> {
    List<SupplierAllocation> findByDepartureId(Long departureId);
}
