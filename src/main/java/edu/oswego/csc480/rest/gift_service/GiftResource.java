package edu.oswego.csc480.rest.gift_service;

import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("user/{user_id}")
public class GiftResource {

    @Inject
    private UserRepository uRepo;

    /*
     *  TODO: CRUD endpoints for user/{id}/gift/{id}, user/{id}/person/{id}/gift/{id}
     */

    //TODO: GET

    public Response getGiftDirect(@PathParam("user_id") Integer uid){
        return null;
    }

    public Response getGiftThroughPerson(@PathParam("user_id") Integer uid){
        return null;
    }

    public Response getEveryGiftFromUser(@PathParam("user_id") Integer uid){
        return null;
    }

    public Response getEveryGiftFromSpecificPerson(@PathParam("user_id") Integer uid){
        return null;
    }

    //TODO POST

    public Response postNewGiftToPerson(@PathParam("user_id") Integer uid){
        return null;
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
