package resource_tests;

import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.entities.UserAttribute;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.gift_service.UserAttributeResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
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

    //GET user attributes tests
    //GET user attributes, 200 success
    @Test
    public void getUserAttributes_200_1() {
        User user = new User();
        UserAttribute a1 = new UserAttribute();
        UserAttribute a2 = new UserAttribute();
        a1.setId(1);
        a1.setAttribute_Name("Shirt Size");
        a1.setValue("XL");
        a2.setId(2);
        a2.setAttribute_Name("Favorite Color");
        a2.setValue("Blue");
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(a1);
        attributes.add(a2);
        user.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getUserAttributes();

        assertEquals(200, response.getStatus());
        assertEquals(attributes, response.getEntity());
        verify(userRepository).findById(1);
    }

    //GET user attributes empty, 200 success
    @Test
    public void getUserAttributes_200_2() {
        User user = new User();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getUserAttributes();
        assertEquals(200, response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());
    }

    //GET user attributes, 404, no user
    @Test
    public void getUserAttributes_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.getUserAttributes();
        assertEquals(404, response.getStatus());
    }

    //CREATE user attributes tests
    //CREATE user attributes, 201 success
    @Test
    public void createAttribute_201() {
        User user = new User();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserAttribute attribute = new UserAttribute();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt size");
        attribute.setValue("XL");
        attribute.setUser(user);

        Response response = resource.createAttribute(attribute);
        assertEquals(201, response.getStatus());
        assertTrue(user.getAttributes().contains(attribute));
        assertSame(user, attribute.getUser());
        verify(userRepository).save(user);
    }

    //CREATE user attributes, 400, null
    @Test
    public void createAttribute_400_1() {
        Response response = resource.createAttribute(null);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(any());
    }

    //CREATE user attributes, 400, attribute name missing
    @Test
    public void createAttribute_400_2() {
        User user = new User();
        UserAttribute attribute = new UserAttribute();
        attribute.setId(null);
        attribute.setAttribute_Name(null);
        attribute.setValue("XL");
        attribute.setUser(user);

        Response response = resource.createAttribute(attribute);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(any());
    }

    //CREATE user attributes, 400, value missing
    @Test
    public void createAttribute_400_3() {
        User user = new User();
        UserAttribute attribute = new UserAttribute();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt Size");
        attribute.setValue(null);
        attribute.setUser(user);

        Response response = resource.createAttribute(attribute);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(any());
    }

    //CREATE user attributes, 404, user entity does not exist
    @Test
    public void createAttribute_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        UserAttribute attribute = new UserAttribute();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt Size");
        attribute.setValue("XL");

        Response response = resource.createAttribute(attribute);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(User.class));
    }

    //UPDATE user attributes, 204 success
    @Test
    public void updateAttribute_204() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        existing.setUser(user);
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        user.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserAttribute updated = new UserAttribute();
        updated.setId(5);
        updated.setAttribute_Name("Shirt size");
        updated.setValue("L");
        Response response = resource.updateAttribute(5, updated);
        assertEquals(204, response.getStatus());
        assertEquals("L", existing.getValue());
        assertEquals("Shirt size", existing.getAttribute_Name());
        verify(userRepository).save(user);
    }

    //UPDATE user attributes, 400, invalid attribute name
    @Test
    public void updateAttribute_400_1() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        existing.setUser(user);
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        user.setAttributes(attributes);

        UserAttribute updated = new UserAttribute();
        updated.setId(5);
        updated.setAttribute_Name(null);
        updated.setValue("L");

        Response response = resource.updateAttribute(5, updated);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(any());
    }

    //UPDATE user attributes, 400, invalid value
    @Test
    public void updateAttribute_400_2() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        existing.setUser(user);
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        user.setAttributes(attributes);

        UserAttribute updated = new UserAttribute();
        updated.setId(5);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue(null);

        Response response = resource.updateAttribute(5, updated);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(any());
    }

    //UPDATE user attributes, 404, user entity does not exist
    @Test
    public void updateAttribute_404_1() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        existing.setUser(user);
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);

        UserAttribute updated = new UserAttribute();
        updated.setId(5);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue("L");

        Response response = resource.updateAttribute(5, updated);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(User.class));
    }

    //UPDATE user attributes, 404, attribute does not exist
    @Test
    public void updateAttribute_404_2() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        user.setAttributes(attributes);
        UserAttribute updated = new UserAttribute();
        updated.setId(5);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue("L");

        Response response = resource.updateAttribute(999, updated);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(User.class));
    }

    //DELETE attributes tests
    //DELETE attributes, 204 success
    @Test
    public void deleteAttribute_204() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        user.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        Response response = resource.deleteAttribute(5);
        assertEquals(204, response.getStatus());
        assertTrue(user.getAttributes().isEmpty());
        verify(userRepository).save(user);
    }

    //DELETE attributes, 404, user entity does not exist
    @Test
    public void deleteAttribute_404_1() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        existing.setUser(user);
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        Response response = resource.deleteAttribute(5);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(User.class));
    }

    //DELETE attributes, 404 attribute does not exist
    @Test
    public void deleteAttribute_404_2() {
        User user = new User();
        UserAttribute existing = new UserAttribute();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("XL");
        List<UserAttribute> attributes = new ArrayList<>();
        attributes.add(existing);
        user.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.deleteAttribute(999);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(User.class));
    }
}
