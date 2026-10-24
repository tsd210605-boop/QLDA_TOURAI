package tourism_app.booking_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tourism_app.booking_service.model.Supplier;
import tourism_app.booking_service.service.OperationsService;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    private final OperationsService operationsService;

    public SupplierController(OperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(operationsService.getAllSuppliers());
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(operationsService.saveSupplier(supplier));
    }
}
