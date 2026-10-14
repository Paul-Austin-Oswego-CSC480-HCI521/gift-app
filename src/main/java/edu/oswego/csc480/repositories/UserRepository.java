package edu.oswego.csc480.repositories;

import edu.oswego.csc480.entities.Users;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;

@Repository(dataStore = "jdbc/giftapp")
public interface UserRepository extends CrudRepository<Users,Integer> {
    @Save
    Users save(Users user);
}
