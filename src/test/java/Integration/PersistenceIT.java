package Integration;

import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.jboss.arquillian.junit.Arquillian;

import java.util.List;

@RunWith(Arquillian.class)
public class PersistenceIT {

    @Inject
    private UserRepository uRepo;


    @Test
    void GetAllReturnsNonEmptyList(){
        List<User> users = uRepo.findAll().toList();
        Assertions.assertFalse(users.isEmpty());
    }



}
