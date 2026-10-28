package resource_tests;

import edu.oswego.csc480.entities.People;
import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.gift_service.PeopleResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PeopleResourceTest {
    private UserRepository userRepository;
    private PeopleResource resource;

    @BeforeEach
    public void setUp() throws Exception {
        userRepository = mock(UserRepository.class);
        resource = new PeopleResource();
        java.lang.reflect.Field field = PeopleResource.class.getDeclaredField("userRepository");
        field.setAccessible(true);
        field.set(resource, userRepository);
    }

    //GET all people tests
    //GET all people belonging to a user, 200 success
    @Test
    public void getPeople_200() {
        Users user = new Users();
        People person1 = new People();
        person1.setId(1);
        People person2 = new People();
        person2.setId(2);
        ArrayList<People> people = new ArrayList<>();
        people.add(person1);
        people.add(person2);
        user.setPeople(people);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getPeople(1);
        assertEquals(200, response.getStatus());
        assertEquals(people, response.getEntity());
        verify(userRepository).findById(1);
    }

    //GET all people for a user, 404, user entity does not exist
    @Test
    public void getPeople_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.getPeople(1);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
    }

    //GET single person tests
    //GET single person from a user, 200 success
    @Test
    public void getPerson_200() {
        Users user = new Users();
        People person = new People();
        person.setId(1);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getPerson(1, 1);
        assertEquals(200, response.getStatus());
        assertEquals(person, response.getEntity());
        verify(userRepository).findById(1);
    }

    //GET single person from a user, 404, user entity does not exist
    @Test
    public void getPerson_404_1() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.getPerson(1, 1);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
    }

    //GET single person from a user, 404, person entity does not exist
    @Test
    public void getPerson_404_2() {
        Users user = new Users();
        People person = new People();
        person.setId(1);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getPerson(1, 999);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
    }

    //CREATE person tests
    //CREATE new person, 201 success
    @Test
    public void createPerson_201() {
        Users user= new Users();
        ArrayList<People> people = new ArrayList<>();
        user.setPeople(people);
        People person = new People();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        Response response = resource.createPerson(1, person);
        assertEquals(201, response.getStatus());
        assertEquals(person, response.getEntity());
        assertEquals(user, person.getUser());
        assertTrue(user.getPeople().contains(person));
        verify(userRepository).findById(1);
        verify(userRepository).save(user);
    }

    //CREATE new person, 400, person entity does not exist (no attributes inputted)
    @Test
    public void createPerson_400() {
        Response response = resource.createPerson(1, null);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any(Users.class));
    }

    //CREATE new person, 404, user entity does not exist
    @Test
    public void createPerson_404() {
        People person = new People();
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.createPerson(1, person);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any(Users.class));
    }

    //UPDATE person tests
    //UPDATE existing person, 200, success
    @Test
    public void updatePerson_200() {
        Users user = new Users();
        People existingPerson = new People();
        existingPerson.setId(1);
        ArrayList<People> people = new ArrayList<>();
        people.add(existingPerson);
        user.setPeople(people);
        People updatedPerson = new People();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        Response response = resource.updatePerson(1, 1, updatedPerson);
        assertEquals(200, response.getStatus());
        assertEquals(updatedPerson, response.getEntity());
        assertEquals(1, updatedPerson.getId());
        assertEquals(user, updatedPerson.getUser());
        assertFalse(user.getPeople().contains(existingPerson));
        assertTrue(user.getPeople().contains(updatedPerson));
        verify(userRepository).findById(1);
        verify(userRepository).save(user);
    }

    //UPDATE existing person, 404, user entity does not exist
    @Test
    public void updatePerson_404_1() {
        People updatedPerson = new People();
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.updatePerson(1, 1, updatedPerson);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any(Users.class));
    }

    //UPDATE existing person, 404, selected person entity does not exist
    @Test
    public void updatePerson_404_2() {
        Users user = new Users();
        People existingPerson = new People();
        existingPerson.setId(1);
        ArrayList<People> people = new ArrayList<>();
        people.add(existingPerson);
        user.setPeople(people);
        People updatedPerson = new People();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.updatePerson(1, 999, updatedPerson);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any(Users.class));
    }

    //DELETE person tests
    //DELETE existing person, 204 success
    @Test
    public void deletePerson_204() {
        Users user = new Users();
        People person = new People();
        person.setId(1);
        ArrayList<People> people = new ArrayList<>();
        people.add(person);
        user.setPeople(people);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        Response response = resource.deletePerson(1, 1);
        assertEquals(204, response.getStatus());
        assertFalse(user.getPeople().contains(person));
        verify(userRepository).findById(1);
        verify(userRepository).save(user);
    }

    //DELETE existing person, 404, user entity does not exist
    @Test
    public void deletePerson_404_1() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.deletePerson(1,1);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any(Users.class));
    }

    //DELETE existing person, 404, selected person entity does not exist
    @Test
    public void deletePerson_404_2() {
        Users user = new Users();
        People existingPerson = new People();
        existingPerson.setId(1);
        ArrayList<People> people = new ArrayList<>();
        people.add(existingPerson);
        user.setPeople(people);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.deletePerson(1, 999);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any(Users.class));
    }
}
