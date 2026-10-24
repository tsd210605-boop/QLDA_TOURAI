package tourism_application.destination_service.controller;

import tourism_application.destination_service.model.Destination;
import tourism_application.destination_service.service.DestinationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController
{
    private final DestinationService service;

    public DestinationController(DestinationService service) {
        this.service = service;
    }

    // Get all destinations
    @GetMapping
    public ResponseEntity<List<Destination>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Get destination by ID
    @GetMapping("/{id}")
    public ResponseEntity<Destination> getById(@PathVariable Long id) {
        Destination destination = service.getById(id);
        return ResponseEntity.ok(destination);
    }

    // Get destinations by category
    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<Destination>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getByCategory(category));
    }

    // Get all destinations grouped by category
    @GetMapping("/by-categories")
    public ResponseEntity<Map<String, List<Destination>>> getByCategories() {
        List<Destination> all = service.getAll();
        Map<String, List<Destination>> grouped = all.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getCategory() != null ? d.getCategory() : "Uncategorized"
                ));
        return ResponseEntity.ok(grouped);
    }
}
