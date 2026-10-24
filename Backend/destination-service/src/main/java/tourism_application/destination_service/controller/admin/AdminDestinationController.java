package tourism_application.destination_service.controller.admin;

import tourism_application.destination_service.model.Destination;
import tourism_application.destination_service.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/destinations")
public class AdminDestinationController {

    @Autowired
    private DestinationRepository destinationRepository;

    // GET ALL DESTINATIONS
    @GetMapping
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    // GET DESTINATION BY ID
    @GetMapping("/{id}")
    public Destination getDestinationById(@PathVariable Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
    }

    // ADD DESTINATION
    @PostMapping
    public Destination addDestination(@Valid @RequestBody Destination destination) {
        return destinationRepository.save(destination);
    }

    // UPDATE DESTINATION
    @PutMapping("/{id}")
    public Destination updateDestination(@PathVariable Long id, @Valid @RequestBody Destination updatedDestination) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destination.setName(updatedDestination.getName());
        destination.setDescription(updatedDestination.getDescription());
        destination.setLocation(updatedDestination.getLocation());
        destination.setCategory(updatedDestination.getCategory());
        destination.setImageUrl(updatedDestination.getImageUrl());

        return destinationRepository.save(destination);
    }

    // DELETE DESTINATION
    @DeleteMapping("/{id}")
    public void deleteDestination(@PathVariable Long id) {
        destinationRepository.deleteById(id);
    }
}
