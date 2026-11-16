package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.entities.UserAttribute;
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
public class UserAttributeResource {
    @Inject
    private UserRepository userRepository;

    @PathParam("uid")
    private Integer uid;

    private Logger log = LoggerFactory.getLogger(UserAttributeResource.class);

    @GET
    public Response getUserAttributes() {

        log.info("User {} requested their preferences.", uid);

        Optional<User> user = userRepository.findById(uid);

        if (user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        User currentUser = user.get();

        if (currentUser.getAttributes() == null
                || currentUser.getAttributes().isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(currentUser.getAttributes().get(0)).build();
    }

    @POST
    public Response createUserAttributes(UserAttribute attributes) {

        if (attributes == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<User> user = userRepository.findById(uid);

        if (user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        User currentUser = user.get();

        if (currentUser.getAttributes() == null) {
            currentUser.setAttributes(new ArrayList<>());
        }

        // Only allow one preferences record per user
        if (!currentUser.getAttributes().isEmpty()) {
            log.warn("User {} already has preferences.", uid);
            return Response.status(Response.Status.CONFLICT).build();
        }

        attributes.setId(null);
        attributes.setUser(currentUser);

        currentUser.getAttributes().add(attributes);

        userRepository.save(currentUser);

        log.info("User {} created their preferences.", uid);

        return Response.status(Response.Status.CREATED)
                .entity(attributes)
                .build();
    }

    @PUT
    public Response updateUserAttributes(UserAttribute attributes) {

        if (attributes == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Optional<User> user = userRepository.findById(uid);

        if (user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        User currentUser = user.get();

        if (currentUser.getAttributes() == null
                || currentUser.getAttributes().isEmpty()) {
            log.debug("User {} does not have preferences.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UserAttribute existing = currentUser.getAttributes().get(0);

        existing.setFavoriteColor(attributes.getFavoriteColor());
        existing.setShirtSize(attributes.getShirtSize());
        existing.setPantSize(attributes.getPantSize());
        existing.setShoeSize(attributes.getShoeSize());
        existing.setJacketSize(attributes.getJacketSize());
        existing.setDressSize(attributes.getDressSize());
        existing.setPreferredFit(attributes.getPreferredFit());
        existing.setStyleDescription(attributes.getStyleDescription());
        existing.setFavoriteBrands(attributes.getFavoriteBrands());
        existing.setFavoriteFoods(attributes.getFavoriteFoods());
        existing.setFavoriteDrinks(attributes.getFavoriteDrinks());
        existing.setRingSize(attributes.getRingSize());
        existing.setMetalPreference(attributes.getMetalPreference());
        existing.setLikes(attributes.getLikes());
        existing.setDislikes(attributes.getDislikes());
        existing.setInterests(attributes.getInterests());

        userRepository.save(currentUser);

        log.info("User {} updated their preferences.", uid);

        return Response.noContent().build();
    }

    @DELETE
    public Response deleteUserAttributes() {

        log.info("User {} is deleting their preferences.", uid);

        Optional<User> user = userRepository.findById(uid);

        if (user.isEmpty()) {
            log.warn("User {} does not exist.", uid);
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        User currentUser = user.get();

        if (currentUser.getAttributes() == null
                || currentUser.getAttributes().isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        currentUser.getAttributes().clear();

        userRepository.save(currentUser);

        log.info("User {} deleted their preferences.", uid);

        return Response.noContent().build();
    }
}
