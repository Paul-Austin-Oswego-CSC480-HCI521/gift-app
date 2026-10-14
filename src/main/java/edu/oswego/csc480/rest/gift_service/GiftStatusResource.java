package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Gift;
import edu.oswego.csc480.entities.GiftStatus;
import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;

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


    //TODO:           GET POST PUT DELETE

    @GET
    public Response getStatus(){
        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()) return Response.status(Status.NOT_FOUND).build();
        Gift gift = OccasionResource.getGift(user.get(), gid);
        if (gift == null) return Response.status(Status.NOT_FOUND).build();
        return Response.ok(gift.getStatus()).build();
    }

    @POST
    public Response createStatus(GiftStatus status){

        // THIS SHOULD NOT BE NECESSARY, ADD THE STATUS OBJECT DIRECTLY IN THE POST REQUEST TO GIFT!!!!

        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()) return Response.status(Status.NOT_FOUND).build();
        Gift gift = OccasionResource.getGift(user.get(), gid);
        if (gift == null) return Response.status(Status.NOT_FOUND).build();

        gift.setStatus(status);
        User nuser = uRepo.save(user.get());
        gift = OccasionResource.getGift(nuser, gid);

        return Response.created(UriBuilder.fromPath("user/{uid}/gift/{gid}/status").build(uid,gid)).build();
    }

    @PUT
    public Response updateStatus(GiftStatus status){

        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()) return Response.status(Status.NOT_FOUND).build();
        Gift gift = OccasionResource.getGift(user.get(), gid);
        if (gift == null) return Response.status(Status.NOT_FOUND).build();

        gift.setStatus(status);

        uRepo.save(user.get());

        return Response.noContent().build();

    }

    @DELETE
    public Response deleteStatus(){
        // DO NOT USE
        // THIS ITEM GETS DELETED WHEN GIFT GETS DELETED. NO GIFT SHOULD BE LACKING OF ITS OWN STATUS.
        return Response.status(Status.METHOD_NOT_ALLOWED).build();
    }













}
