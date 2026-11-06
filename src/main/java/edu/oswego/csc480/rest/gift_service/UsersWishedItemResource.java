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

@Path("user/{uid}/preferences")
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
    public Response getPreferences() {
        log.info("User {} requested their wished items list.", uid);
        Optional<Users> user = userRepository.findById(uid);

        if(user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(user.get().getWishlist()).build();
    }

    @POST
    public Response createPreferences(UsersWishedItem item) {
        if (item == null) {
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
    public Response updatePreferences(UsersWishedItem item) {
        if(item == null) {
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

        UsersWishedItem existing = currentUser.getWishlist().get(0);

        existing.setFavoriteColor(item.getFavoriteColor());
        existing.setShirtSize(item.getShirtSize());
        existing.setPantSize(item.getPantSize());
        existing.setShoeSize(item.getShoeSize());
        existing.setJacketSize(item.getJacketSize());
        existing.setDressSize(item.getDressSize());
        existing.setPreferredFit(item.getPreferredFit());
        existing.setStyleDescription(item.getStyleDescription());
        existing.setFavoriteBrands(item.getFavoriteBrands());
        existing.setFavoriteFoods(item.getFavoriteFoods());
        existing.setFavoriteDrinks(item.getFavoriteDrinks());
        existing.setRingSize(item.getRingSize());
        existing.setMetalPreference(item.getMetalPreference());
        existing.setLikes(item.getLikes());
        existing.setDislikes(item.getDislikes());
        existing.setInterests(item.getInterests());
        userRepository.save(currentUser);
        log.info("User {} updated their preferences.", uid);
        return Response.noContent().build();
    }

    @DELETE
    public Response deleteWishedItem() {
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

        currentUser.getWishlist().clear();

        userRepository.save(currentUser);

        log.info("User {} deleted their preferences.", uid);
        return Response.noContent().build();
    }
}
