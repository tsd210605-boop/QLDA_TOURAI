package tourism_application.destination_service.service;

import tourism_application.destination_service.model.Destination;
import tourism_application.destination_service.repository.DestinationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService
{
    private final DestinationRepository repository;

    public DestinationService(DestinationRepository repository) {
        this.repository = repository;
    }

    // Get all destinations
    public List<Destination> getAll() {
        return repository.findAll();
    }

    // Get destination by ID
    public Destination getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found: " + id));
    }

    // Get destinations by category
    public List<Destination> getByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }

    // Create new destination
    public Destination create(Destination destination) {
        return repository.save(destination);
    }

    // Update existing destination
    public Destination update(Long id, Destination updatedData) {
        Destination existing = getById(id);

        existing.setName(updatedData.getName());
        existing.setDescription(updatedData.getDescription());
        existing.setLocation(updatedData.getLocation());
        existing.setCategory(updatedData.getCategory());
        existing.setAvgPrice(updatedData.getAvgPrice());
        existing.setImageUrl(updatedData.getImageUrl());

        return repository.save(existing);
    }

    // Delete destination
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete — destination not found: " + id);
        }
        repository.deleteById(id);
    }
}
