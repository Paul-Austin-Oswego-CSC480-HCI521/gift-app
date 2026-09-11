package edu.oswego.csc480.repositories;

import edu.oswego.csc480.entities.TestEntity;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Delete;
import jakarta.data.repository.Repository;
import jakarta.data.repository.Save;

import java.util.Optional;

@Repository(dataStore = "jdbc/giftapp")
public interface TestRepository extends CrudRepository<TestEntity, Integer> {

	@Save
	TestEntity save(TestEntity e);

	Optional<TestEntity> findById(int id);

	Optional<TestEntity> findByFirstName(String firstName);

	@Delete
	void delete(TestEntity e);
}
