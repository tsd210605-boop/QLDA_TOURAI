package tourism_app.packages_service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tourism_app.packages_service.controller.admin.AdminPackageItineraryController;
import tourism_app.packages_service.exception.GlobalExceptionHandler;
import tourism_app.packages_service.model.Package;
import tourism_app.packages_service.model.PackageItinerary;
import tourism_app.packages_service.repository.PackageItineraryRepository;
import tourism_app.packages_service.repository.PackageRepository;
import tourism_app.packages_service.service.PackageItineraryService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PackageItineraryControllerTest {
    @Mock private PackageRepository packages;
    @Mock private PackageItineraryRepository itineraries;
    private MockMvc mvc;
    private Package tour;

    @BeforeEach
    void setUp() {
        tour = new Package();
        tour.setPackageId(7L);
        tour.setDuration("3 days");
        PackageItineraryService service = new PackageItineraryService(itineraries, packages);
        mvc = MockMvcBuilders.standaloneSetup(new AdminPackageItineraryController(service))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }

    private String body(int day) {
        return "{\"dayNumber\":" + day + ",\"description\":\"Visit the destination\"}";
    }

    private PackageItinerary existing(int day) {
        PackageItinerary item = new PackageItinerary();
        item.setItineraryId(11L);
        item.setDayNumber(day);
        item.setDescription("Original activities");
        item.setPkg(tour);
        return item;
    }

    @ParameterizedTest
    @ValueSource(ints = {-1, 0, 4, 99})
    void rejectsDaysOutsideTourOnCreate(int day) throws Exception {
        when(packages.findById(7L)).thenReturn(Optional.of(tour));
        mvc.perform(post("/admin/packages/7/itineraries")
                        .contentType(MediaType.APPLICATION_JSON).content(body(day)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Tour có 3 ngày. Ngày lịch trình phải từ 1 đến 3."));
        verify(itineraries, never()).save(any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"3 days", "3 ngày", "3", "3N2Đ", "3 ngày 2 đêm", " 3 DAYS / 2 NIGHTS "})
    void acceptsLastDayAcrossSupportedDurationFormats(String duration) throws Exception {
        tour.setDuration(duration);
        when(packages.findById(7L)).thenReturn(Optional.of(tour));
        when(itineraries.save(any())).thenAnswer(call -> call.getArgument(0));
        mvc.perform(post("/admin/packages/7/itineraries")
                        .contentType(MediaType.APPLICATION_JSON).content(body(3)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.dayNumber").value(3));
        verify(itineraries).save(any());
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"", "unknown", "3 hours", "2.5 days", "0 days", "999999999999 days"})
    void rejectsUnknownOrInvalidTourDuration(String duration) throws Exception {
        tour.setDuration(duration);
        when(packages.findById(7L)).thenReturn(Optional.of(tour));
        mvc.perform(post("/admin/packages/7/itineraries")
                        .contentType(MediaType.APPLICATION_JSON).content(body(1)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").exists());
        verify(itineraries, never()).save(any());
    }

    @Test
    void rejectsDuplicateDay() throws Exception {
        when(packages.findById(7L)).thenReturn(Optional.of(tour));
        when(itineraries.findByPkg_PackageId(7L)).thenReturn(List.of(existing(2)));
        mvc.perform(post("/admin/packages/7/itineraries")
                        .contentType(MediaType.APPLICATION_JSON).content(body(2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Ngày 2 đã có lịch trình. Vui lòng chọn ngày khác."));
        verify(itineraries, never()).save(any());
    }

    @Test
    void rejectsBlankActivities() throws Exception {
        when(packages.findById(7L)).thenReturn(Optional.of(tour));
        mvc.perform(post("/admin/packages/7/itineraries").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dayNumber\":1,\"description\":\"   \"}"))
                .andExpect(status().isBadRequest());
        verify(itineraries, never()).save(any());
    }

    @Test
    void rejectsOutOfRangeUpdateWithoutMutatingExistingDay() throws Exception {
        PackageItinerary item = existing(1);
        when(itineraries.findById(11L)).thenReturn(Optional.of(item));
        mvc.perform(put("/admin/packages/itinerary/11")
                        .contentType(MediaType.APPLICATION_JSON).content(body(4)))
                .andExpect(status().isBadRequest());
        verify(itineraries, never()).save(any());
        assertEquals(1, item.getDayNumber());
        assertEquals("Original activities", item.getDescription());
    }

    @Test
    void allowsUpdatingActivitiesWithoutTreatingItselfAsDuplicate() throws Exception {
        PackageItinerary item = existing(3);
        when(itineraries.findById(11L)).thenReturn(Optional.of(item));
        when(itineraries.findByPkg_PackageId(7L)).thenReturn(List.of(item));
        when(itineraries.save(any())).thenAnswer(call -> call.getArgument(0));
        mvc.perform(put("/admin/packages/itinerary/11")
                        .contentType(MediaType.APPLICATION_JSON).content(body(3)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.dayNumber").value(3));
    }

    @Test
    void rejectsUpdatingToAnotherExistingDay() throws Exception {
        PackageItinerary item = existing(1);
        PackageItinerary other = existing(2);
        other.setItineraryId(12L);
        when(itineraries.findById(11L)).thenReturn(Optional.of(item));
        when(itineraries.findByPkg_PackageId(7L)).thenReturn(List.of(item, other));
        mvc.perform(put("/admin/packages/itinerary/11")
                        .contentType(MediaType.APPLICATION_JSON).content(body(2)))
                .andExpect(status().isBadRequest());
        verify(itineraries, never()).save(any());
        assertEquals(1, item.getDayNumber());
    }
}
