package edu.oswego.csc480.rest;

import jakarta.json.Json;
import jakarta.json.JsonString;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;

@Path("ping")
@Produces(MediaType.APPLICATION_JSON)
public class DevResource {

	@GET
	public Response ping(){

		return Response.ok(Json.createObjectBuilder()
				.add("status","200 OK").build()).build();
	}
}
