package edu.oswego.csc480.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import java.time.Instant;

@Path("dev")
public class DevResource {

	@Path("ping")
	@GET
	public String ping(HttpServletRequest req){
		String time = Instant.now().toString();
		return String.format("server request received %s", time);
	}

}
