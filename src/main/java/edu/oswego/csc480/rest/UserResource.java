package edu.oswego.csc480.rest;

import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("user")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    private UserRepository uRepo;

    @GET
    public Response getUsers(){

    }

    @GET
    @Path("{id}")
    public Response getUser(@PathParam("id") Integer user_id){

    }







}
