package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Gift;
import edu.oswego.csc480.entities.Person;
import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.Optional;

import static jakarta.ws.rs.core.Response.Status;

@Path("user/{user_id}")
@Produces(MediaType.APPLICATION_JSON)
public class GiftResource {

    @Inject
    private UserRepository uRepo;

    /*
     *  TODO: CRUD endpoints for user/{id}/gift/{id}, user/{id}/person/{id}/gift/{id}
     */

    @Path("gift/{id}")
    @GET
    public Response getGiftDirect(@PathParam("user_id") Integer uid, @PathParam("id") Integer gid){

        Optional<User> user = uRepo.findById(uid);

        if (user.isEmpty()){
            return Response.status(Status.NOT_FOUND).build();
        }
        ArrayList<Gift> gifts = new ArrayList<>();

        // i want to try to learn to like streams (I hate it!)

        Gift gift = user.get().getPeople().stream()
                .flatMap(p->p.getGifts().stream())
                .filter(g -> g.getId().equals(gid))
                .findFirst().orElse(null);

        if (gift == null){
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(gift).build();


    }

    @Path("gift")
    @GET
    public Response getEveryGiftFromUser(@PathParam("user_id") Integer uid){
        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()){
            return Response.status(Status.NOT_FOUND).build();
        }
        ArrayList<Gift> gifts = new ArrayList<>();
        user.get().getPeople().forEach(p->p.getGifts().forEach(g->gifts.add(g)));
        return Response.ok(gifts).build();
    }

    @Path("person/{pid}/gift")
    @GET
    public Response getEveryGiftFromSpecificPerson(@PathParam("user_id") Integer uid, @PathParam("pid") Integer pid){
        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()){
            return Response.status(Status.NOT_FOUND).build();
        }
        Person person = user.get().getPeople().stream()
                .filter(p->p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (person==null) return Response.status(Status.NOT_FOUND).build();

        return Response.ok(person.getGifts()).build();

    }

    //TODO POST
    public Response postNewGiftToPerson(@PathParam("user_id") Integer uid){





    }

    //TODO UPDATE
    public Response updateGiftDirect(@PathParam("user_id") Integer uid){
        return null;
    }

    public Response updateGiftFromUser(@PathParam("user_id") Integer uid){
        return null;
    }
    //TODO DELETE

    public Response nukeItAll(@PathParam("user_id") Integer uid){
        return null;
    }
    public Response deleteGift(@PathParam("user_id") Integer uid){
        return null;
    }
    public Response charcoal(@PathParam("user_id") Integer uid){
        return null;
    }

}
