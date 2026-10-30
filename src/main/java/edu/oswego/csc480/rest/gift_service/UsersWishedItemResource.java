package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.entities.UsersWishedItem;
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

@Path("user/{uid}/wished_items")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class UsersWishedItemResource {
    @Inject
    private UserRepository userRepository;

    @PathParam("uid")
    private Integer uid;

    private Logger log = LoggerFactory.getLogger(UsersWishedItemResource.class);

    @GET
    public Response getWishedItems() {
        log.info("User {} requested their wished items list.", uid);
        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
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
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getWishlist() == null) {
            log.debug("Created an empty wishlist for user {}.", uid);
            currentUser.setWishlist(new ArrayList<>());
        }

        item.setId(null);
        item.setUser(currentUser);currentUser.getWishlist().add(item);
        userRepository.save(currentUser);

        log.info("User {} added an item to their wishlist.", uid);

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
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();
        if(currentUser.getWishlist() == null) {
            log.debug("Cannot update wished item as wishlist does not exist for user {}.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersWishedItem existing = currentUser.getWishlist().stream()
                .filter(w -> w.getId() != null && w.getId().equals(wid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            log.debug("Wished item {} does not exist.", wid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setGiftName(item.getGiftName());
        existing.setValue(item.getValue());
        log.info("User {} updated wished item {} in their wishlist.", uid, wid);
        userRepository.save(currentUser);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{wid}")
    public Response deleteWishedItem(@PathParam("wid") Integer wid) {
        Optional<Users> user = userRepository.findById(uid);
        if(user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Users currentUser = user.get();

        if(currentUser.getWishlist() == null) {
            log.debug("User {} does not have a wishlist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UsersWishedItem existing = currentUser.getWishlist().stream()
                .filter(w -> w.getId() != null && w.getId().equals(wid))
                .findFirst()
                .orElse(null);

        if(existing == null) {
            log.debug("Wished item {} does not exist.", wid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        currentUser.getWishlist().remove(existing);
        userRepository.save(currentUser);
        log.info("User {} deleted wished item {} from their wishlist.", uid, wid);
        return Response.noContent().build();
    }
}
