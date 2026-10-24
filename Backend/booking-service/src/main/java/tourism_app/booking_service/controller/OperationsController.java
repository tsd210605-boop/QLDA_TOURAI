package tourism_app.booking_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tourism_app.booking_service.dto.DispatchRequest;
import tourism_app.booking_service.dto.SupplierBookingRequest;
import tourism_app.booking_service.model.SupplierAllocation;
import tourism_app.booking_service.model.TourDeparture;
import tourism_app.booking_service.service.OperationsService;

import java.util.List;

@RestController
@RequestMapping("/operations")
public class OperationsController {

    private final OperationsService operationsService;

    public OperationsController(OperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping("/tours")
    public ResponseEntity<List<TourDeparture>> getAllDepartures() {
        return ResponseEntity.ok(operationsService.getAllDepartures());
    }

    @GetMapping("/tours/{depId}")
    public ResponseEntity<TourDeparture> getDepartureById(@PathVariable Long depId) {
        return ResponseEntity.ok(operationsService.getDepartureById(depId));
    }

    @PostMapping("/tours/{depId}/dispatch")
    public ResponseEntity<TourDeparture> dispatchTour(
            @PathVariable Long depId,
            @RequestBody DispatchRequest request) {
        return ResponseEntity.ok(operationsService.dispatchTour(depId, request));
    }

    @PostMapping("/tours/{depId}/book-supplier")
    public ResponseEntity<SupplierAllocation> bookSupplier(
            @PathVariable Long depId,
            @RequestBody SupplierBookingRequest request) {
        return ResponseEntity.ok(operationsService.bookSupplier(depId, request));
    }

    @GetMapping("/tours/{depId}/allocations")
    public ResponseEntity<List<SupplierAllocation>> getTourAllocations(@PathVariable Long depId) {
        return ResponseEntity.ok(operationsService.getAllocationsForDeparture(depId));
    }
}
