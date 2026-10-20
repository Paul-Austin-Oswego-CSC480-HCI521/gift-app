package resource_tests;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.gift_service.UsersResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UsersResourceTest {

    private UserRepository userRepository;
    private UsersResource resource;

    @BeforeEach
    public void setUp() throws Exception {
        userRepository = mock(UserRepository.class);
        resource = new UsersResource();
        java.lang.reflect.Field field = UsersResource.class.getDeclaredField("userRepository");
        field.setAccessible(true);
        field.set(resource, userRepository);
    }

    //GET all users tests
    //GET all users, 200 success
    @Test
    public void getUsers_200() {
        Users user1 = new Users();
        Users user2 = new Users();

        List<Users> users = List.of(user1, user2);
        when(userRepository.findAll()).thenReturn(users.stream());
        Response response = resource.getUsers();
        assertEquals(200, response.getStatus());
        List<Users> result = (List<Users>) response.getEntity();
        assertEquals(2, result.size());
        assertEquals(user1, result.get(0));
        assertEquals(user2, result.get(1));
        verify(userRepository).findAll();
    }

    //GET single user tests
    //GET single user, 200 success
    @Test
    public void getUser_200() {
        Users user = new Users();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.getUser(1);
        assertEquals(200, response.getStatus());
        assertEquals(user, response.getEntity());
        verify(userRepository).findById(1);
    }

    //GET single user, 404, selected user entity does not exist
    @Test
    public void getUser_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.getUser(1);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
    }

    //CREATE user tests
    //CREATE new user, 201 success
    @Test
    public void createUser_201() {
        Users user = new Users();
        when(userRepository.save(user)).thenReturn(user);
        Response response = resource.createUser(user);
        assertEquals(201, response.getStatus());
        assertEquals(user, response.getEntity());
        verify(userRepository).save(user);
    }

    //CREATE new user, 400, user entity does not exist (no attributes passed)
    @Test
    public void createUser_400() {
        Response response = resource.createUser(null);
        assertEquals(400, response.getStatus());
        verify(userRepository, never()).save(any(Users.class));
    }

    //UPDATE user tests
    //UPDATE existing user, 200 success
    @Test
    public void updateUser_200() {
        Users existingUser = new Users();
        Users updatedUser = new Users();
        when(userRepository.findById(1)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(Users.class))).thenReturn(updatedUser);
        Response response = resource.updateUser(1, updatedUser);
        assertEquals(200, response.getStatus());
        assertEquals(updatedUser, response.getEntity());
        verify(userRepository).findById(1);
        verify(userRepository).save(any(Users.class));
    }

    //UPDATE existing user, 404, existing user does not exist
    @Test
    public void updateUser_404() {
        Users updatedUser = new Users();
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.updateUser(1, updatedUser);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any(Users.class));
    }

    //DELETE user tests
    //DELETE existing user, 204 success
    @Test
    public void deleteUser_204() {
        Users user = new Users();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Response response = resource.deleteUser(1);
        assertEquals(204, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository).deleteById(1);
    }

    //DELETE existing user, 404, selected user does not exist
    @Test
    public void deleteUser_404() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        Response response = resource.deleteUser(1);
        assertEquals(404, response.getStatus());
        verify(userRepository).findById(1);
        verify(userRepository, never()).deleteById(any());
    }
}
