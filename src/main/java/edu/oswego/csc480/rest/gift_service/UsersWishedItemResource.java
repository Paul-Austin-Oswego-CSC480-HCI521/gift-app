package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.entities.UsersWishedItem;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.annotation.security.RolesAllowed;
import java.util.ArrayList;
import java.util.Optional;

@Path("user/{uid}/wished_items")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class UsersWishedItemResource {
    @Inject
    private UserRepository userRepository;

    @PathParam("uid")
    private Integer uid;

    @GET
    public Response getWishedItems() {
        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(user.get().getWishlist()).build();
    }

    @POST
    public Response createWishedItem(UsersWishedItem item) {
        if (item == null
                || item.getGiftName() == null
                || item.getGiftName().isBlank()
                || item.getValue() == null
                || item.getValue().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getWishlist() == null) {
            currentUser.setWishlist(new ArrayList<>());
        }

        item.setId(null);
        item.setUser(currentUser);currentUser.getWishlist().add(item);
        userRepository.save(currentUser);

        return Response.status(Response.Status.CREATED)
                .entity(item)
                .build();
    }

    @PUT
    @Path("/{wid}")
    public Response updateWishedItem(@PathParam("wid") Integer wid, UsersWishedItem item) {
        if(item == null
                || item.getGiftName() == null
                || item.getGiftName().isBlank()
                || item.getValue() == null
                || item.getValue().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();
        if(currentUser.getWishlist() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersWishedItem existing = currentUser.getWishlist().stream()
                .filter(w -> w.getId() != null && w.getId().equals(wid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setGiftName(item.getGiftName());
        existing.setValue(item.getValue());

        userRepository.save(currentUser);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{wid}")
    public Response deleteWishedItem(@PathParam("wid") Integer wid) {
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getWishlist() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersWishedItem existing = currentUser.getWishlist().stream()
                .filter(w -> w.getId() != null && w.getId().equals(wid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        currentUser.getWishlist().remove(existing);
        userRepository.save(currentUser);

        return Response.noContent().build();
    }
}
