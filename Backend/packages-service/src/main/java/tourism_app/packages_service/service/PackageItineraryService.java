// Quản lý từng ngày lịch trình và kiểm tra ngày hợp lệ theo thời lượng của tour cha.

package tourism_app.packages_service.service;

import org.springframework.stereotype.Service;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.repository.PackageItineraryRepository;
import tourism_app.packages_service.repository.PackageRepository;

import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PackageItineraryService {
    private static final Pattern DURATION_DAYS = Pattern.compile(
            "^(\\d+)(?:\\s*(?:days?|ngày)(?=\\s|/|$)|\\s*n(?=\\s|\\d|$)|$)",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

    private final PackageItineraryRepository itineraryRepository;
    private final PackageRepository packageRepository;

    /** Nhận repository lịch trình để ghi từng ngày và repository tour để đọc dữ liệu tour cha. */
    public PackageItineraryService(PackageItineraryRepository itineraryRepository,
                                   PackageRepository packageRepository) {
        this.itineraryRepository = itineraryRepository;
        this.packageRepository = packageRepository;
    }

    /** Đọc các bản ghi lịch trình thuộc packageId. Truy vấn hiện không quy định thứ tự của các ngày. */
    public List<PackageItinerary> getItineraryByPackage(Long packageId) {
        return itineraryRepository.findByPkg_PackageId(packageId);
    }

    /** Tìm tour cha, kiểm tra dữ liệu ngày, xóa ID từ body để tạo mới rồi gắn tour và lưu. */
    public PackageItinerary createItinerary(Long packageId, PackageItinerary itinerary) {
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found with ID: " + packageId));
        validateItinerary(pkg, itinerary, null);
        itinerary.setItineraryId(null);
        itinerary.setPkg(pkg);
        return itineraryRepository.save(itinerary);
    }

    /** Tìm bản ghi và tour cha hiện có, kiểm tra dữ liệu ngày mới rồi cập nhật số thứ tự và mô tả. */
    public PackageItinerary updateItinerary(Long itineraryId, PackageItinerary updatedItinerary) {
        PackageItinerary existing = getItineraryById(itineraryId);
        validateItinerary(existing.getPkg(), updatedItinerary, itineraryId);
        existing.setDayNumber(updatedItinerary.getDayNumber());
        existing.setDescription(updatedItinerary.getDescription());
        return itineraryRepository.save(existing);
    }

    /** Kiểm tra ngày trong khoảng từ 1 đến thời lượng tour, mô tả khác trắng và ngày chưa được dùng. Khi sửa, bỏ qua chính ID đang sửa. */
    private void validateItinerary(Package pkg, PackageItinerary itinerary, Long excludedId) {
        int durationDays = getDurationDays(pkg.getDuration());
        int day = itinerary.getDayNumber();
        if (day < 1 || day > durationDays) {
            throw new IllegalArgumentException(
                    "Tour có " + durationDays + " ngày. Ngày lịch trình phải từ 1 đến " + durationDays + ".");
        }
        if (itinerary.getDescription() == null || itinerary.getDescription().isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập mô tả lịch trình.");
        }
        boolean duplicate = itineraryRepository.findByPkg_PackageId(pkg.getPackageId()).stream()
                .anyMatch(item -> item.getDayNumber() == day
                        && (excludedId == null || !Objects.equals(item.getItineraryId(), excludedId)));
        if (duplicate) {
            throw new IllegalArgumentException("Ngày " + day + " đã có lịch trình. Vui lòng chọn ngày khác.");
        }
    }

    /** Đọc số ngày nguyên dương ở đầu chuỗi thời lượng, hỗ trợ các dạng như 3 days, 3 ngày và 3N2Đ. */
    private int getDurationDays(String duration) {
        Matcher matcher = DURATION_DAYS.matcher(duration == null ? "" : duration.trim());
        if (matcher.find()) {
            try {
                int days = Integer.parseInt(matcher.group(1));
                if (days > 0) return days;
            } catch (NumberFormatException ignored) {
                // Reject a duration that cannot be represented as a positive integer.
            }
        }
        throw new IllegalArgumentException("Không xác định được số ngày của tour. Vui lòng cập nhật thời lượng tour.");
    }

    /** Kiểm tra bản ghi tồn tại rồi xóa theo itineraryId. */
    public void deleteItinerary(Long itineraryId) {
        if (!itineraryRepository.existsById(itineraryId)) {
            throw new RuntimeException("Itinerary not found with ID: " + itineraryId);
        }
        itineraryRepository.deleteById(itineraryId);
    }

    /** Tìm một bản ghi ngày lịch trình theo khóa chính và báo lỗi nếu thiếu. */
    public PackageItinerary getItineraryById(Long itineraryId) {
        return itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found with ID: " + itineraryId));
    }
}
