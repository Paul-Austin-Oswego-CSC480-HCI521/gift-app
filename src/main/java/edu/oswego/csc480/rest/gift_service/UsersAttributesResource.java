package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.entities.UsersAttributes;
import edu.oswego.csc480.repositories.UserRepository;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Optional;

@Path("user/{uid}/attributes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class UsersAttributesResource {
    @Inject
    private UserRepository userRepository;

    @PathParam("uid")
    private Integer uid;

    @GET
    public Response getUserAttributes() {
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(user.get().getAttributes()).build();
    }

    @POST
    public Response createAttribute(UsersAttributes attribute) {
        if(attribute == null
            || attribute.getAttribute_Name() == null
            || attribute.getAttribute_Name().isBlank()
            || attribute.getValue() == null
            || attribute.getValue().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<Users>user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getAttributes() == null) {
            currentUser.setAttributes(new ArrayList<>());
        }

        attribute.setId(null);
        attribute.setUser(currentUser);
        currentUser.getAttributes().add(attribute);
        userRepository.save(currentUser);

        return Response.status(Response.Status.CREATED)
                .entity(attribute)
                .build();
    }

    @PUT
    @Path("/{aid}")
    public Response updateAttribute(@PathParam("aid") Integer aid, UsersAttributes attribute) {
        if(attribute == null
                || attribute.getAttribute_Name() == null
                || attribute.getAttribute_Name().isBlank()
                || attribute.getValue() == null
                || attribute.getValue().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getAttributes() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersAttributes existing = currentUser.getAttributes().stream()
                .filter(a -> a.getId() != null && a.getId().equals(aid))
                .findFirst()
                .orElse(null);
        if(existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setAttribute_Name(attribute.getAttribute_Name());
        existing.setValue(attribute.getValue());
        userRepository.save(currentUser);

        return Response.noContent().build();
    }

    @DELETE
    @Path("/{aid}")
    public Response deleteAttribute(@PathParam("aid") Integer aid) {
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getAttributes() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersAttributes existing = currentUser.getAttributes().stream()
                .filter(a -> a.getId() != null && a.getId().equals(aid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        currentUser.getAttributes().remove(existing);
        userRepository.save(currentUser);
        return Response.noContent().build();
    }
}
