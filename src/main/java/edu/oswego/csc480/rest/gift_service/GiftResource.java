package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Gift;
import edu.oswego.csc480.entities.Person;
import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;

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

    @Path("person/{pid}/gift")
    @POST
    public Response postNewGiftToPerson(
            @PathParam("user_id") Integer uid,
            @PathParam("pid") Integer pid,
            Gift gift
            ){

        if (gift==null || gift.getName().isBlank() || gift.getType().isBlank() || gift.getCycle() == null){
            return Response.status(Status.BAD_REQUEST).build();
        }

        Optional<User> optUser = uRepo.findById(uid);

        if (optUser.isEmpty()) return Response.status(Status.NOT_FOUND).build();

        Person person = optUser.get().getPeople().stream()
                .filter(p->p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (person==null) return Response.status(Status.NOT_FOUND).build();

        person.getGifts().add(gift);
        gift.setPerson(person);

        User user = uRepo.save(optUser.get());

        final String giftName = gift.getName();

        gift = user.getPeople().stream()
                .filter(p->p.getId().equals(pid))
                .findFirst()
                .orElse(null).getGifts()
                .stream()
                .filter(g -> g.getName().equalsIgnoreCase(giftName))
                .findFirst()
                .orElse(null);


        Integer gid = gift.getId();

        return Response.created(UriBuilder.fromPath("api/user/{uid}/gift/{gid}").build(uid, gid)).build();

    }

    @Path("gift/{gid}")
    @POST
    public Response updateGiftDirect(@PathParam("user_id") Integer uid, @PathParam("gid") Integer gid, Gift gift){

        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()) return Response.status(Status.NOT_FOUND).build();

        Person person = null;
        Gift  currentGift = null;

        for (Person p : user.get().getPeople()){
            if (p.getGifts().isEmpty()) continue;
            for (Gift g : p.getGifts()){
                if (!g.getId().equals(gid)) continue;
                person = p;
                currentGift = g;
                 // 204 success but no body
            }
        }

        if (person != null && currentGift != null){
            person.getGifts().remove(currentGift);
            person.getGifts().add(gift);
            uRepo.save(user.get());
            return Response.noContent().build();
        }

        return Response.status(Status.NOT_FOUND).build(); // because it did not find the specific gift to update.

    }

    //TODO DELETE

    @Path("gift")
    @DELETE
    public Response nukeItAll(@PathParam("user_id") Integer uid){
        Optional<User> user = uRepo.findById(uid);
        if (user.isEmpty()) return Response.status(Status.NOT_FOUND).build();

        user.get().getPeople().forEach(p -> p.getGifts().clear());
        uRepo.save(user.get());

        return Response.noContent().build();

    }
    public Response deleteGift(@PathParam("user_id") Integer uid){
        return null;
    }
    public Response charcoal(@PathParam("user_id") Integer uid){
        return null;
    }


}
