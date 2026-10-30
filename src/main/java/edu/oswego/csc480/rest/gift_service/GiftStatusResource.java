package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Gifts;
import edu.oswego.csc480.entities.GiftStatus;
import edu.oswego.csc480.entities.Users;
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

@Path("user/{uid}/gift/{gid}/status")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class GiftStatusResource {

    @Inject
    private UserRepository uRepo;

    private @PathParam("uid") Integer uid;
    private @PathParam("gid") Integer gid;

    private Logger log = LoggerFactory.getLogger(GiftStatusResource.class);

    @GET
    public Response getStatus(){
        log.info("User {} requested status for gift {}",uid, gid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.warn("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        Gifts gift = OccasionResource.getGift(user.get(), gid);
        if (gift == null){
            log.debug("Gift {} does not exist.", gid);
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(gift.getStatus()).build();
    }

    @POST
    public Response createStatus(GiftStatus status){

        // THIS SHOULD NOT BE NECESSARY, ADD THE STATUS OBJECT DIRECTLY IN THE POST REQUEST TO GIFT!!!!

        log.warn("DO NOT USE createStatus AT GiftStatusResource");

        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.warn("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        Gifts gift = OccasionResource.getGift(user.get(), gid);
        if (gift == null){
            log.debug("Gift {} does not exist.", gid);
            return Response.status(Status.NOT_FOUND).build();
        }

        gift.setStatus(status);
        Users nuser = uRepo.save(user.get());
        //gift = OccasionResource.getGift(nuser, gid);

        return Response.created(UriBuilder.fromPath("user/{uid}/gift/{gid}/status").build(uid,gid)).build();
    }

    @PUT
    public Response updateStatus(GiftStatus status){

        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.warn("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        Gifts gift = OccasionResource.getGift(user.get(), gid);
        if (gift == null){
            log.debug("Gift {} does not exist.", gid);
            return Response.status(Status.NOT_FOUND).build();
        }
        String oldStatus = gift.getStatus().getStage();
        gift.setStatus(status);
        log.info("User {} has updated the status ({}) for gift {} from {} to {}",
                uid, status.getId(), gift.getId(), oldStatus, status.getStage());
        uRepo.save(user.get());

        return Response.noContent().build();

    }

    @DELETE
    public Response deleteStatus(){
        // DO NOT USE
        // THIS ITEM GETS DELETED WHEN GIFT GETS DELETED. NO GIFT SHOULD BE LACKING OF ITS OWN STATUS.
        log.warn("User {} attempted to use deleteStatus which is not allowed.", uid);
        return Response.status(Status.METHOD_NOT_ALLOWED).build();
    }
}
