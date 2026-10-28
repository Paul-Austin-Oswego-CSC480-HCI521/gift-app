package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Path("user")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class UsersResource {

    private Logger log = LoggerFactory.getLogger(UsersResource.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    JsonWebToken token;

    //Returns all users
    //maybe should not allow "user" to access it?
    @GET
    public Response getUsers() {
        log.warn("Got request for querying EVERY USER from user {}.", token.getSubject());
        List<Users> users = userRepository.findAll().toList();
        return Response.ok(users).build();
    }

    //Return a single user
    @GET
    @Path("/{id}")
    public Response getUser(@PathParam("id") Integer id) {
        log.info("Query for user {}.", id);
        return userRepository.findById(id)
                .map(user -> Response.ok(user).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    //Creates a new user
    @POST
    public Response createUser(Users user) {
        if (user == null) {
            log.info("User creation request failed. No user information provided.");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Users savedUser = userRepository.save(user);
        log.info("User with id {} created.", savedUser.getId());
        return Response
                .status(Response.Status.CREATED)
                .entity(savedUser)
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") Integer id, Users updatedUser) {
        log.info("Request to update user {} received.", id);
        Users existingUser = userRepository.findById(id)
                .orElse(null);
        if(existingUser == null) {
            log.info("User {} was not found in database.", id);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        updatedUser.setId(id);
        Users savedUser = userRepository.save(updatedUser);
        log.info("User {} updated successfully.", id);
        updatedUser.setPasswordHash(existingUser.getPasswordHash()); //Copy password hash from existing user on to update user to save it
        return Response.ok(savedUser).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") Integer id) {
        log.info("Deletion request from user {} received.", id);
        Users existingUser = userRepository.findById(id)
                .orElse(null);
        if(existingUser == null) {
            log.warn("User deletion for user {} was invalid. User does not exist.", id);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        userRepository.deleteById(id);
        log.info("User {} has been deleted.", id);
        return Response.noContent().build();
    }
}
