package resource_tests;

import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.entities.UserAttribute;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.gift_service.UserAttributeResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserAttributeResourceTest {
    private UserRepository userRepository;
    private UserAttributeResource resource;

    @BeforeEach
    public void setUp() throws Exception {
        userRepository = mock(UserRepository.class);
        resource = new UserAttributeResource();
        java.lang.reflect.Field repoField = UserAttributeResource.class.getDeclaredField("userRepository");
        repoField.setAccessible(true);
        repoField.set(resource, userRepository);

        java.lang.reflect.Field uidField = UserAttributeResource.class.getDeclaredField("uid");
        uidField.setAccessible(true);
        uidField.set(resource, 1);
    }

    @Test
    public void getUserAttributes_200() {
        User user = new User();
        UserAttribute preferences = new UserAttribute();
        preferences.setShirtSize("XL");
        preferences.setFavoriteColor("Blue");
        user.getAttributes().add(preferences);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        try (Response response = resource.getUserAttributes()) {
            assertEquals(200, response.getStatus());
            assertSame(preferences, response.getEntity());
        }
        verify(userRepository).findById(1);
    }

    @Test
    public void getUserAttributes_emptyPreferences_404() {
        when(userRepository.findById(1)).thenReturn(Optional.of(new User()));

        try (Response response = resource.getUserAttributes()) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    public void getUserAttributes_missingUser_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        try (Response response = resource.getUserAttributes()) {
            assertEquals(404, response.getStatus());
        }
    }

    @Test
    public void createUserAttributes_201() {
        User user = new User();
        user.setAttributes(null);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        UserAttribute preferences = new UserAttribute();
        preferences.setId(5);
        preferences.setShirtSize("XL");

        try (Response response = resource.createUserAttributes(preferences)) {
            assertEquals(201, response.getStatus());
            assertSame(preferences, response.getEntity());
        }
        assertEquals(List.of(preferences), user.getAttributes());
        assertSame(user, preferences.getUser());
        assertNull(preferences.getId());
        verify(userRepository).save(user);
    }

    @Test
    public void createUserAttributes_nullPayload_400() {
        try (Response response = resource.createUserAttributes(null)) {
            assertEquals(400, response.getStatus());
        }
        verifyNoInteractions(userRepository);
    }

    @Test
    public void createUserAttributes_missingUser_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        try (Response response = resource.createUserAttributes(new UserAttribute())) {
            assertEquals(404, response.getStatus());
        }
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void createUserAttributes_duplicatePreferences_409() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        user.getAttributes().add(existing);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        try (Response response = resource.createUserAttributes(new UserAttribute())) {
            assertEquals(409, response.getStatus());
        }
        assertEquals(List.of(existing), user.getAttributes());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void updateUserAttributes_204() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setUser(user);
        existing.setShirtSize("XL");
        existing.setFavoriteColor("Blue");
        user.getAttributes().add(existing);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        UserAttribute updated = new UserAttribute();
        updated.setId(10);
        updated.setShirtSize("L");
        updated.setShoeSize("10.5");

        try (Response response = resource.updateUserAttributes(updated)) {
            assertEquals(204, response.getStatus());
        }
        assertEquals(5, existing.getId());
        assertSame(user, existing.getUser());
        assertEquals("L", existing.getShirtSize());
        assertEquals("10.5", existing.getShoeSize());
        assertNull(existing.getFavoriteColor());
        verify(userRepository).save(user);
    }

    @Test
    public void updateUserAttributes_nullPayload_400() {
        try (Response response = resource.updateUserAttributes(null)) {
            assertEquals(400, response.getStatus());
        }
        verifyNoInteractions(userRepository);
    }

    @Test
    public void updateUserAttributes_missingUser_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        try (Response response = resource.updateUserAttributes(new UserAttribute())) {
            assertEquals(404, response.getStatus());
        }
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void updateUserAttributes_emptyPreferences_404() {
        when(userRepository.findById(1)).thenReturn(Optional.of(new User()));

        try (Response response = resource.updateUserAttributes(new UserAttribute())) {
            assertEquals(404, response.getStatus());
        }
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void deleteUserAttributes_204() {
        User user = new User();
        user.getAttributes().add(new UserAttribute());
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        try (Response response = resource.deleteUserAttributes()) {
            assertEquals(204, response.getStatus());
        }
        assertTrue(user.getAttributes().isEmpty());
        verify(userRepository).save(user);
    }

    @Test
    public void deleteUserAttributes_missingUser_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        try (Response response = resource.deleteUserAttributes()) {
            assertEquals(404, response.getStatus());
        }
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void deleteUserAttributes_emptyPreferences_404() {
        when(userRepository.findById(1)).thenReturn(Optional.of(new User()));

        try (Response response = resource.deleteUserAttributes()) {
            assertEquals(404, response.getStatus());
        }
        verify(userRepository, never()).save(any(User.class));
    }
}
