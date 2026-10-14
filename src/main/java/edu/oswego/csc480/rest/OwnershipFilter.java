package edu.oswego.csc480.rest;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Provider
public class OwnershipFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext con) throws IOException {
        String path = con.getUriInfo().getPath();
        List<String> pathItems = List.of(path.split("/"));

        if (pathItems.contains("auth") || pathItems.contains("ping")) return;
        // those must be public


        //make sure stuff being accessed is the owner's

        JsonWebToken token = (JsonWebToken) con.getSecurityContext().getUserPrincipal();
        if (token == null){
            con.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }
        String id = token.getSubject();

        String pathuid = "";

        for (String s : pathItems){
            if (s.equalsIgnoreCase("user")){
                pathuid = pathItems.get(pathItems.indexOf(s)+1);
            }
        }
        if (pathuid == "" || !pathuid.equalsIgnoreCase(id)){
            con.abortWith(Response.status(Response.Status.FORBIDDEN).build());
            return;
        }
    }
}
