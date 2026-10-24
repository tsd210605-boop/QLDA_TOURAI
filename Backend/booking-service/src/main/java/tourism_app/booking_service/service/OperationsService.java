package tourism_app.booking_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tourism_app.booking_service.dto.DispatchRequest;
import tourism_app.booking_service.dto.SupplierBookingRequest;
import tourism_app.booking_service.model.Supplier;
import tourism_app.booking_service.model.SupplierAllocation;
import tourism_app.booking_service.model.TourDeparture;
import tourism_app.booking_service.repository.SupplierAllocationRepository;
import tourism_app.booking_service.repository.SupplierRepository;
import tourism_app.booking_service.repository.TourDepartureRepository;

import java.util.List;

@Service
public class OperationsService {

    private final TourDepartureRepository departureRepository;
    private final SupplierRepository supplierRepository;
    private final SupplierAllocationRepository allocationRepository;

    public OperationsService(TourDepartureRepository departureRepository,
                             SupplierRepository supplierRepository,
                             SupplierAllocationRepository allocationRepository) {
        this.departureRepository = departureRepository;
        this.supplierRepository = supplierRepository;
        this.allocationRepository = allocationRepository;
    }

    public List<TourDeparture> getAllDepartures() {
        return departureRepository.findAllByOrderByDepartureDateAsc();
    }

    public TourDeparture getDepartureById(Long depId) {
        return departureRepository.findById(depId)
                .orElseThrow(() -> new RuntimeException("Tour departure not found with ID: " + depId));
    }

    @Transactional
    public TourDeparture dispatchTour(Long depId, DispatchRequest request) {
        TourDeparture dep = getDepartureById(depId);
        if (request.getTourGuideName() != null) dep.setTourGuideName(request.getTourGuideName());
        if (request.getTourGuidePhone() != null) dep.setTourGuidePhone(request.getTourGuidePhone());
        if (request.getVehicleNumber() != null) dep.setVehicleNumber(request.getVehicleNumber());
        if (request.getDriverName() != null) dep.setDriverName(request.getDriverName());
        if (request.getDriverPhone() != null) dep.setDriverPhone(request.getDriverPhone());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            dep.setStatus(request.getStatus());
        } else {
            dep.setStatus("DISPATCHED");
        }
        if (request.getNotes() != null) dep.setNotes(request.getNotes());

        return departureRepository.save(dep);
    }

    @Transactional
    public SupplierAllocation bookSupplier(Long depId, SupplierBookingRequest request) {
        // Validate departure
        getDepartureById(depId);

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + request.getSupplierId()));

        SupplierAllocation allocation = new SupplierAllocation();
        allocation.setDepartureId(depId);
        allocation.setSupplierId(request.getSupplierId());
        allocation.setServiceName(request.getServiceName());
        allocation.setServiceType(request.getServiceType() != null ? request.getServiceType() : supplier.getServiceType());
        allocation.setEstimatedCost(request.getEstimatedCost());
        allocation.setVoucherCode("VOUCHER-" + depId + "-" + System.currentTimeMillis() % 10000);
        allocation.setBookingStatus("CONFIRMED");
        allocation.setNotes(request.getNotes());

        // Update supplier debt
        if (request.getEstimatedCost() != null) {
            supplier.setCurrentDebt(supplier.getCurrentDebt().add(request.getEstimatedCost()));
            supplierRepository.save(supplier);
        }

        return allocationRepository.save(allocation);
    }

    public List<SupplierAllocation> getAllocationsForDeparture(Long depId) {
        return allocationRepository.findByDepartureId(depId);
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }
}
