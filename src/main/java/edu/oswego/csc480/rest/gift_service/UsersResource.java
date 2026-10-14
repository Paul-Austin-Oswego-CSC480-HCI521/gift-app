package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("user")
@Produces(MediaType.APPLICATION_JSON)
public class UsersResource {

    @Inject
    private UserRepository userRepository;

    //Returns all users
    @GET
    public Response getUsers() {
        List<User> users = userRepository.findAll().toList();
        return Response.ok(users).build();
    }

    //Return a single user
    @GET
    @Path("/{id}")
    public Response getUser(@PathParam("id") Integer id) {
        return userRepository.findById(id)
                .map(user -> Response.ok(user).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    //Creates a new user
    @POST
    public Response createUser(User user) {
        if (user == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        User savedUser = userRepository.save(user);
        return Response
                .status(Response.Status.CREATED)
                .entity(savedUser)
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") Integer id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElse(null);
        if(existingUser == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        updatedUser.setId(id);
        updatedUser.setPasswordHash(existingUser.getPasswordHash()); //Copy password hash from existing user on to update user to save it
        User savedUser = userRepository.save(updatedUser);
        return Response.ok(savedUser).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") Integer id) {
        User existingUser = userRepository.findById(id)
                .orElse(null);
        if(existingUser == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        userRepository.deleteById(id);
        return Response.noContent().build();
    }
}
