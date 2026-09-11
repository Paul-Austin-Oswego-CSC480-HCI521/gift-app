package edu.oswego.csc480.repositories;

import edu.oswego.csc480.entities.TestEntity;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;

import java.util.Optional;

@Repository
public interface TestRepository extends CrudRepository<TestEntity, Integer> {


	Optional<TestEntity> findById(Integer id);

}
