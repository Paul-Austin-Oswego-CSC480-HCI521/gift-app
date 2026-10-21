package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.entities.People;
import edu.oswego.csc480.entities.PeopleAttributes;
import edu.oswego.csc480.repositories.UserRepository;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Optional;

@Path("user/{uid}/person/{pid}/attributes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class PeopleAttributesResource {
    @Inject
    private UserRepository userRepository;

    @PathParam("uid")
    private Integer uid;

    private People findPerson(Integer pid) {
        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            return null;
        }

        return user.get().getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);
    }

    @GET
    public Response getAttributes(@PathParam("pid") Integer pid) {
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        People person = user.get().getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);

        if(person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if(person.getAttributes() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(person.getAttributes()).build();
    }

    @POST
    public Response createAttributes(@PathParam("pid") Integer pid, PeopleAttributes attributes) {
        if(attributes == null
            || attributes.getAttribute_name() == null
            || attributes.getAttribute_name().isBlank()
            || attributes.getValue() == null
            || attributes.getValue().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        People person = user.get().getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);

        if(person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if(person.getAttributes() == null) {
            person.setAttributes(new java.util.ArrayList<>());
        }

        attributes.setId(null);
        attributes.setPerson(person);
        person.getAttributes().add(attributes);
        userRepository.save(user.get());
        return Response.status(Response.Status.CREATED).build();
    }

    @Path("/{aid}")
    @PUT
    public Response updateAttributes(@PathParam("pid") Integer pid, @PathParam("aid") Integer aid, PeopleAttributes attributes) {
        if(attributes == null
                || attributes.getAttribute_name() == null
                || attributes.getAttribute_name().isBlank()
                || attributes.getValue() == null
                || attributes.getValue().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        People person = user.get().getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);

        if(person == null || person.getAttributes() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        PeopleAttributes existing = person.getAttributes().stream()
                .filter(a -> a.getId().equals(aid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setAttribute_Name(attributes.getAttribute_name());
        existing.setValue(attributes.getValue());
        userRepository.save(user.get());
        return Response.noContent().build();
    }

    @Path("/{aid}")
    @DELETE
    public Response deleteAttribute(@PathParam("pid") Integer pid, @PathParam("aid") Integer aid) {
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        People person = user.get().getPeople().stream()
                .filter(p -> p.getId().equals(pid))
                .findFirst()
                .orElse(null);

        if(person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        PeopleAttributes attribute = person.getAttributes().stream()
                .filter(a -> a.getId().equals(aid))
                .findFirst()
                .orElse(null);

        if(attribute == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        person.getAttributes().remove(attribute);
        userRepository.save(user.get());
        return Response.noContent().build();
    }
}
