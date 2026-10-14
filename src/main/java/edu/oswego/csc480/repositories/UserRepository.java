package edu.oswego.csc480.repositories;

import edu.oswego.csc480.entities.User;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.By;
import jakarta.data.repository.Find;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Repository(dataStore = "jdbc/giftapp")
public interface UserRepository extends CrudRepository<User,Integer> {
    @Find
    Optional<User> findByEmail(@By("email") String email);

    @Save
    User save(User user);
}
