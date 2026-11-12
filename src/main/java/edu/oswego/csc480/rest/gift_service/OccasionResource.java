package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Gift;
import edu.oswego.csc480.entities.Occasion;
import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

import static jakarta.ws.rs.core.Response.Status;

@Path("user/{uid}/gift/{gid}/occasion")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class OccasionResource {

    private @PathParam("uid") Integer uid;
    private @PathParam("gid") Integer gid;

    private Logger log = LoggerFactory.getLogger(OccasionResource.class);

    @Inject
    private UserRepository uRepo;

    @GET
    public Response getOccasion(){
        log.info("User {} requested occasion for gift {}.", uid, gid);
        Optional<User> user = uRepo.findById(uid);

        if (user.isEmpty()){
            log.warn("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        Gift gift = getGift(user.get(), gid);

        if (gift == null){
            log.debug("Gift {} does not exist.", gid);
            return Response.status(Status.NOT_FOUND).build();
        }

        Occasion occasion = gift.getOccasion();

        // occasion could be null, in the case no occasion was given unlike giftStatus

        return Response.ok(occasion).build();

    }

    // I guess you could... but you could just include
    // the occasion when posting to gift directly
    @POST
    public Response postOccasion(Occasion occasion){
        log.info("User {} requested creation of new Occasion for gift {}.", uid, gid);
        Optional<User> user = uRepo.findById(uid);

        if (user.isEmpty()){
            log.warn("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        Gift gift = getGift(user.get(), gid);
        gift.setOccasion(occasion);
        User nuser = uRepo.save(user.get());
        gift = getGift(nuser, gid);

        if (gift == null){
            log.debug("Gift {} does not exist", gid);
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }

        return Response.created(UriBuilder.fromPath("user/{uid}/gift/{gid}/occasion").build(uid, gid)).build();

    }

    @PUT
    public Response putOccasion(Occasion occasion){
        log.info("User {} requested update of gift {}'s occasion", uid, gid);
        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.warn("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        Gift gift = getGift(user.get(), gid);
        if (gift == null){
            log.debug("Gift {} does not exist.", gid);
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }

        gift.setOccasion(occasion);
        User nuser = uRepo.save(user.get());
        gift = getGift(nuser, gid);

        return Response.ok(gift).build();

    }

    // I really don't see the use for this, as opposed to deleting the gift or updating the occasion
    @DELETE
    public Response deleteOccasion(){
        log.info("User {} requested deletion of gift {}'s occasion.", uid, gid);
        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        Gift gift = getGift(user.get(), gid);
        if (gift == null){
            log.debug("Gift {} does not exist.", gid);
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }
        gift.setOccasion(null);
        uRepo.save(user.get());
        return Response.noContent().build();
    }

    static Gift getGift(User user, Integer gid){
        return user.getPeople().stream()
                .flatMap(p -> p.getGifts().stream())
                .filter(g->g.getId().equals(gid))
                .findFirst()
                .orElse(null);
    }


}
