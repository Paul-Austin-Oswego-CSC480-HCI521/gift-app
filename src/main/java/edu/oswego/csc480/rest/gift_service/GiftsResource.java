package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.entities.Gifts;
import edu.oswego.csc480.entities.People;
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

import java.util.ArrayList;
import java.util.Optional;

import static jakarta.ws.rs.core.Response.Status;

@Path("user/{uid}/gift")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class GiftsResource {

    @Inject
    private UserRepository uRepo;

    @PathParam("uid")
    private Integer uid;

    private Logger log = LoggerFactory.getLogger(GiftsResource.class);

    @Path("/{gid}")
    @GET
    public Response getGiftDirect( @PathParam("gid") Integer gid){
        log.info("User {} requested gift with id of {}.", uid, gid);
        Optional<Users> user = uRepo.findById(uid);

        if (user.isEmpty()){
            log.info("User with id {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        ArrayList<Gifts> gifts = new ArrayList<>();

        Gifts gift = user.get().getPeople().stream()
                .flatMap(p->p.getGifts().stream())
                .filter(g -> g.getId().equals(gid))
                .findFirst().orElse(null);

        if (gift == null){
            log.debug("Gift with id of {} does not exist or is not {}'s", gid, uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(gift).build();
    }

    @GET
    public Response getEveryGiftFromUser(){
        log.info("Request to get every gift from user {}", uid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        ArrayList<Gifts> gifts = new ArrayList<>();
        user.get().getPeople().forEach(p->p.getGifts().forEach(g->gifts.add(g)));
        return Response.ok(gifts).build();
    }

    @Path("/person/{pid}")
    @GET
    public Response getEveryGiftFromSpecificPerson(@PathParam("pid") Integer pid){
        log.info("Request to get every gift for person {} from user {}.", pid, uid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist", uid);
            return Response.status(Status.NOT_FOUND).build();
        }
        People person = user.get().getPeople().stream()
                .filter(p->p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (person==null){
            log.debug("Person {} does not exist.", pid);
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(person.getGifts()).build();
    }

    @Path("/person/{pid}")
    @POST
    public Response postNewGiftToPerson(@PathParam("pid") Integer pid, Gifts gift){
        log.info("User {} attempts to create a gift for person {}.", uid, pid);
        if (gift==null || gift.getName().isBlank() || gift.getType().isBlank() || gift.getStatus() == null || gift.getStatus() == null){
            log.info("Received invalid gift creation request. uid: {}, pid: {}.", uid, pid);
            return Response.status(Status.BAD_REQUEST).build();
        }

        Optional<Users> optUser = uRepo.findById(uid);

        if (optUser.isEmpty()){
            log.debug("User {} does not exist", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        People person = optUser.get().getPeople().stream()
                .filter(p->p.getId().equals(pid))
                .findFirst()
                .orElse(null);
        if (person==null){
            log.debug("Person {} does not exist", pid);
            return Response.status(Status.NOT_FOUND).build();
        }

        person.getGifts().add(gift);
        gift.setPerson(person);
        Users user = uRepo.save(optUser.get());
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

    @Path("/{gid}")
    @PUT
    public Response updateGiftDirect(@PathParam("gid") Integer gid, Gifts gift){
        log.info("User {} requested update of gift {}.", uid, gid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        People person = null;
        Gifts currentGift = null;

        for (People p : user.get().getPeople()){
            if (p.getGifts().isEmpty()) continue;
            for (Gifts g : p.getGifts()){
                if (!g.getId().equals(gid)) continue;
                person = p;
                currentGift = g;
                 // 204 success but no body
            }
        }
        if (person != null && currentGift != null){
            gift.setPerson(currentGift.getPerson());
            gift.setId(currentGift.getId());
            person.getGifts().remove(currentGift);
            person.getGifts().add(gift);
            uRepo.save(user.get());
            return Response.noContent().build();
        }
        return Response.status(Status.NOT_FOUND).build();
    }

    @DELETE
    public Response nukeItAll(){
        log.info("User {} has chosen to delete every gift.", uid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        user.get().getPeople().forEach(p -> p.getGifts().clear());
        uRepo.save(user.get());

        return Response.noContent().build();
    }
    @Path("/{gid}")
    @DELETE
    public Response deleteGift(@PathParam("gid") Integer gid){
        log.info("User {} has chosen to delete gift {}.", uid, gid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        People person = null;
        Gifts target = null;

        for (People p : user.get().getPeople()){
            if (p.getGifts().isEmpty()) continue;
            for (Gifts g : p.getGifts()){
                if (!g.getId().equals(gid)) continue;
                person = p;
                target = g;
            }
        }

        if (person != null && target != null){
            person.getGifts().remove(target);
            uRepo.save(user.get());
            return Response.noContent().build();
        }
        log.debug("Gift {} does not exist", gid);
        return Response.status(Status.NOT_FOUND).build();

    }
    @Path("/person/{pid}")
    @DELETE
    public Response charcoal(@PathParam("pid") Integer pid){
        log.info("User {} has decided to delete every gift from Person {}", uid, pid);
        Optional<Users> user = uRepo.findById(uid);
        if (user.isEmpty()){
            log.debug("User {} does not exist.", uid);
            return Response.status(Status.NOT_FOUND).build();
        }

        People person = user.get().getPeople().stream()
                .filter(p->p.getId().equals(pid))
                .findFirst()
                .orElse(null);

        if (person == null){
            log.debug("Person {} does not exist", pid);
            return Response.status(Status.NOT_FOUND).build();
        }

        person.getGifts().clear();
        uRepo.save(user.get());

        return Response.noContent().build();

    }
}
