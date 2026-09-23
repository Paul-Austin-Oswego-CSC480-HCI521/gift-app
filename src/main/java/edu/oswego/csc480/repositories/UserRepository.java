package edu.oswego.csc480.repositories;

import edu.oswego.csc480.entities.User;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;

import java.util.List;
import java.util.stream.Stream;

@Repository(dataStore = "jdbc/giftapp")
public interface UserRepository extends CrudRepository<User,Integer> {

    @Save
    User save(User user);

    // findAll() -> Stream<User> Therefore, every time: List<User> users = uRepo.findAll().toList();

    // findById() is standard, no change here. -> Optional<User> so if empty -> no id -> entity

    // deleteById -> void

    //returns an empty list if there is no user with that firstName
    List<User> findByFirstName(String firstName);






}
