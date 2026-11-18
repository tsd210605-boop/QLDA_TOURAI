// Ánh xạ thao tác Spring Data JPA vào bảng destinations và khai báo truy vấn theo danh mục.

package tourism_application.destination_service.repository;

import tourism_application.destination_service.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long>
{
    // Find by category (case-insensitive)
    /** Tìm điểm đến có category khớp giá trị yêu cầu mà không phân biệt hoa thường. */
    List<Destination> findByCategoryIgnoreCase(String category);
}
