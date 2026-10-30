package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.entities.UsersAttributes;
import edu.oswego.csc480.repositories.UserRepository;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.annotation.security.RolesAllowed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Optional;

@Path("user/{uid}/attributes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class UsersAttributesResource {
    @Inject
    private UserRepository userRepository;

    @PathParam("uid")
    private Integer uid;

    private Logger log = LoggerFactory.getLogger(UsersAttributesResource.class);

    @GET
    public Response getUserAttributes() {
        log.info("User {} requested their own attributes", uid);
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            log.debug("User {} does not exist.", uid);
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
            log.debug("User {} does not exist.", uid);
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
        log.info("User {} created a new attribute.", uid);
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
            log.debug("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getAttributes() == null) {
            log.debug("User {} does not have attributes.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersAttributes existing = currentUser.getAttributes().stream()
                .filter(a -> a.getId() != null && a.getId().equals(aid))
                .findFirst()
                .orElse(null);
        if(existing == null) {
            log.debug("User attribute {} does not exist.", aid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setAttribute_Name(attribute.getAttribute_Name());
        existing.setValue(attribute.getValue());
        userRepository.save(currentUser);
        log.info("User {} updated user attribute {}.", uid, aid);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{aid}")
    public Response deleteAttribute(@PathParam("aid") Integer aid) {
        Optional<Users> user = userRepository.findById(uid);
        log.info("User {} is trying to delete attribute {}", uid, aid);
        if(user.isEmpty()) {
            log.debug("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getAttributes() == null) {
            log.debug("User {} does not have attributes", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersAttributes existing = currentUser.getAttributes().stream()
                .filter(a -> a.getId() != null && a.getId().equals(aid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            log.debug("User attribute {} does not exist.", aid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        currentUser.getAttributes().remove(existing);
        userRepository.save(currentUser);
        return Response.noContent().build();
    }
}
