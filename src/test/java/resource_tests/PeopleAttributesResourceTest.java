package resource_tests;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.entities.People;
import edu.oswego.csc480.entities.PeopleAttributes;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.gift_service.PeopleAttributesResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PeopleAttributesResourceTest {
    private UserRepository userRepository;
    private PeopleAttributesResource resource;

    @BeforeEach
    public void setUp() throws Exception {
        userRepository = mock(UserRepository.class);
        resource = new PeopleAttributesResource();

        java.lang.reflect.Field repoField = PeopleAttributesResource.class.getDeclaredField("userRepository");
        repoField.setAccessible(true);
        repoField.set(resource, userRepository);

        java.lang.reflect.Field uidField = PeopleAttributesResource.class.getDeclaredField("uid");
        uidField.setAccessible(true);
        uidField.set(resource, 1);
    }

    //GET attributes
    //GET all attributes, 200 success
    @Test
    public void getAttributes_200_1() {
        Users user = new Users();
        People person = new People();
        person.setId(10);

        PeopleAttributes a1 = new PeopleAttributes();
        a1.setId(1);
        a1.setAttribute_Name("Shirt Size");
        a1.setValue("M");
        a1.setPerson(person);

        PeopleAttributes a2 = new PeopleAttributes();
        a2.setId(2);
        a2.setAttribute_Name("Favorite Color");
        a2.setValue("Blue");
        a2.setPerson(person);

        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(a1);
        attributes.add(a2);
        person.setAttributes(attributes);

        user.setPeople(new ArrayList<>());
        user.getPeople().add(person);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getAttributes(10);
        assertEquals(200, response.getStatus());
        assertEquals(attributes, response.getEntity());
        verify(userRepository).findById(1);
    }

    //GET empty attributes list, 200 success
    @Test
    public void getAttributes_200_2() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        person.setAttributes(new ArrayList<>());
        user.setPeople(new ArrayList<>());
        user.getPeople().add(person);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getAttributes(10);
        assertEquals(200, response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());
    }

    //GET all attributes, 404, user entity does not exist
    @Test
    public void getAttributes_404_1() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.getAttributes(10);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }

    //GET attributes, 404, person entity does not exist
    @Test
    public void getAttributes_404_2() {
        Users user = new Users();
        user.setPeople(new ArrayList<>());
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getAttributes(10);
        assertEquals(404, response.getStatus());
    }

    //CREATE attributes
    //CREATE new attributes list, 201 success
    @Test
    public void createAttributes_201() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes attribute = new PeopleAttributes();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt Size");
        attribute.setValue("M");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        Response response = resource.createAttributes(10, attribute);
        assertEquals(201, response.getStatus());

        assertTrue(person.getAttributes().contains(attribute));
        assertEquals(person, attribute.getPerson());
        verify(userRepository).findById(1);
        verify(userRepository).save(user);
    }

    //CREATE attributes, 400, null attributes
    @Test
    public void create_attributes_400_1() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        Response response = resource.createAttributes(10, null);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(1);
    }

    //CREATE attributes, 400, missing name
    @Test
    public void create_attributes_400_2() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes attribute = new PeopleAttributes();
        attribute.setId(null);
        attribute.setAttribute_Name(null);
        attribute.setValue("M");

        Response response = resource.createAttributes(10, attribute);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(1);
    }

    //CREATE attributes, 400, missing value
    @Test
    public void create_attributes_400_3() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes attribute = new PeopleAttributes();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt Size");
        attribute.setValue(null);

        Response response = resource.createAttributes(10, attribute);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(1);
    }

    //CREATE attributes, 404, no user
    @Test
    public void create_attributes_404_1() {
        People person = new People();
        person.setId(10);
        PeopleAttributes attribute = new PeopleAttributes();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt Size");
        attribute.setValue("M");

        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.createAttributes(10, attribute);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }

    //CREATE attributes, 404, no person
    @Test
    public void createAttributes_2404_2() {
        Users user = new Users();
        People person = new People();
        person.setId(20);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes attribute = new PeopleAttributes();
        attribute.setId(null);
        attribute.setAttribute_Name("Shirt Size");
        attribute.setValue("M");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        Response response = resource.createAttributes(10, attribute);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }

    //UPDATE attributes tests
    //UPDATE attributes, 204 success
    @Test
    public void updateAttributes_204() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);

        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        PeopleAttributes updated = new PeopleAttributes();
        updated.setId(null);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue("L");

        Response response = resource.updateAttributes(10, 5, updated);
        assertEquals(204, response.getStatus());
        assertEquals("Shirt Size", existing.getAttribute_name());
        assertEquals("L", existing.getValue());
        verify(userRepository).save(user);
    }

    //UPDATE attributes, 400, invalid attribute data
    @Test
    public void updateAttributes_400() {
        PeopleAttributes updated = new PeopleAttributes();
        updated.setId(null);
        updated.setAttribute_Name(null);
        updated.setValue("L");

        Response response = resource.updateAttributes(10, 5, updated);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(1);
    }

    //UPDATE attributes, 404, user entity does not exist
    @Test
    public void updateAttributes_404_1() {
        People person = new People();
        person.setId(10);
        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.empty());
        PeopleAttributes updated = new PeopleAttributes();
        updated.setId(null);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue("L");

        Response response = resource.updateAttributes(10, 5, updated);
        assertEquals(404, response.getStatus());
    }

    //UPDATE attributes, 404, person entity does not exist
    @Test
    public void updateAttributes_404_2() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        PeopleAttributes updated = new PeopleAttributes();
        updated.setId(null);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue("L");

        Response response = resource.updateAttributes(999, 5, updated);
        assertEquals(404, response.getStatus());
    }

    //UPDATE attributes, 404, attribute entity does not exist
    @Test
    public void updateAttributes_404_3() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        PeopleAttributes updated = new PeopleAttributes();
        updated.setId(null);
        updated.setAttribute_Name("Shirt Size");
        updated.setValue("L");

        Response response = resource.updateAttributes(10, 999, updated);
        assertEquals(404, response.getStatus());
    }

    //DELETE attribute tests
    //DELETE attributes, 204 success
    @Test
    public void deleteAttribute_204() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        Response response = resource.deleteAttribute(10, 5);
        assertEquals(204, response.getStatus());
        assertTrue(user.getPeople().get(0).getAttributes().isEmpty());
        verify(userRepository).findById(1);
        verify(userRepository).save(user);
    }

    //DELETE attribute, 404, user entity does not exist
    @Test
    public void deleteAttribute_404_1() {
        People person = new People();
        person.setId(10);
        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.deleteAttribute(10, 5);

        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }

    //DELETE attribute, 404, person entity does not exist
    @Test
    public void deleteAttribute_404_2() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        Response response = resource.deleteAttribute(999, 5);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }

    //DELETE attribute, 404, attribute entity does not exist
    @Test
    public void deleteAttribute_404_3() {
        Users user = new Users();
        People person = new People();
        person.setId(10);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);

        PeopleAttributes existing = new PeopleAttributes();
        existing.setId(5);
        existing.setAttribute_Name("Shirt Size");
        existing.setValue("M");
        existing.setPerson(person);
        List<PeopleAttributes> attributes = new ArrayList<>();
        attributes.add(existing);
        person.setAttributes(attributes);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.deleteAttribute(10, 999);
        assertEquals(404, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }
}
