package edu.oswego.csc480.rest.gift_service;

import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("user/{user_id}")
public class GiftResource {

    /*
     *  TODO: CRUD endpoints for user/{id}/gift/{id}, user/{id}/person/{id}/gift/{id}
     */

    //TODO: GET

    public Response getGiftDirect(@PathParam("user_id") Integer uid){

    }

    public Response getGiftThroughPerson(@PathParam("user_id") Integer uid){

    }

    public Response getEveryGiftFromUser(@PathParam("user_id") Integer uid){

    }

    public Response getEveryGiftFromSpecificPerson(@PathParam("user_id") Integer uid){

    }

    //TODO POST

    public Response postNewGiftToPerson(@PathParam("user_id") Integer uid){

    }

    //TODO UPDATE
    public Response updateGiftDirect(@PathParam("user_id") Integer uid){

    }

    public Response updateGiftFromUser(@PathParam("user_id") Integer uid){

    }
    //TODO DELETE

    public Response nukeItAll(@PathParam("user_id") Integer uid){

    }
    public Response deleteGift(@PathParam("user_id") Integer uid){

    }
    public Response charcoal(@PathParam("user_id") Integer uid){

    }

}
