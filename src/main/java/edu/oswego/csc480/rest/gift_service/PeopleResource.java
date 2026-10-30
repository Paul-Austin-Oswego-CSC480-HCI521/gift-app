package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.People;
import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Path("/user/{user_id}/person")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class PeopleResource {

    @Inject
    private UserRepository userRepository;

    private Logger log = LoggerFactory.getLogger(PeopleResource.class);

    //Returns all people belonging to the current user
    @GET
    public Response getPeople(@PathParam("user_id") Integer uid) {
        log.info("User {} requested a list of all their people", uid);
        Optional<Users> user = userRepository.findById(uid);
        if (user.isEmpty()) {
            log.debug("User {} does not exist", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        List<People> people = user.get().getPeople();
        return Response.ok(people).build();
    }

    //Returns one person by ID
    @GET
    @Path("/{pid}")
    public Response getPerson(@PathParam("user_id") Integer uid,
                              @PathParam("pid") Integer pid) {
        log.info("User {} requested person {}.", uid, pid);
        Optional<Users> user = userRepository.findById(uid);
        if (user.isEmpty()) {
            log.debug("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        People person = user.get().getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (person == null) {
            log.debug("Person {} does not exist.", pid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(person).build();
    }

    //Create a new person for the current user
    @POST
    public Response createPerson(@PathParam("user_id") Integer uid, People person) {
        log.info("User {} requested creation of new person.", uid);
        if (person == null) {
            log.debug("Request does not provide a person.");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Optional<Users> optUser = userRepository.findById(uid);
        if (optUser.isEmpty()) {
            log.debug("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Users user = optUser.get();
        person.setUser(user);
        user.getPeople().add(person);
        Users savedUser = userRepository.save(user);
        return Response
                .status(Response.Status.CREATED)
                .entity(person)
                .build();
    }

    //Updates an existing person
    @PUT
    @Path("/{pid}")
    public Response updatePerson(@PathParam("user_id") Integer uid,
                                 @PathParam("pid") Integer pid,
                                 People updatedPerson) {
        Optional<Users> optUser = userRepository.findById(uid);
        if (optUser.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Users user = optUser.get();
        People existingPerson = user.getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (existingPerson == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        updatedPerson.setId(pid);
        updatedPerson.setUser(user);
        user.getPeople().remove(existingPerson);
        user.getPeople().add(updatedPerson);
        userRepository.save(user);
        return Response.ok(updatedPerson).build();
    }

    //Deleting a person
    @DELETE
    @Path("/{pid}")
    public Response deletePerson(@PathParam("user_id") Integer uid,
                                 @PathParam("pid") Integer pid) {
        Optional<Users> optUser = userRepository.findById(uid);
        if (optUser.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Users user = optUser.get();
        People person = user.getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        user.getPeople().remove(person);
        userRepository.save(user);
        return Response.noContent().build();
    }
}
