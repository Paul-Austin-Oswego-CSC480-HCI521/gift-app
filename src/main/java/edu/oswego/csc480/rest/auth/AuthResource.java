package edu.oswego.csc480.rest.auth;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.security.PasswordService;
import edu.oswego.csc480.utils.auth.JwtService;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/auth")
@RequestScoped
@PermitAll
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {
    private static final String DUMMY_HASH = new PasswordService().hash("dummy-password");

    @Inject
    private UserRepository users;

    @Inject
    private PasswordService passwords;

    private JwtService tokens = JwtService.getInstance();

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        if (request == null || request.email == null || request.email.isBlank()
                || request.password == null || request.password.isEmpty()) {
            return reply(Response.Status.BAD_REQUEST,
                    Map.of("message", "Email and password are required."));
        }

        Users user = users.findByEmail(request.email.strip()).orElse(null);
        String storedHash = user == null ? null : user.getPasswordHash();
        String hashToVerify = storedHash == null ? DUMMY_HASH : storedHash;
        boolean verified;
        try {
            verified = passwords.verify(request.password, hashToVerify);
        } catch (IllegalArgumentException invalidHashOrPassword) {
            verified = false;
        }

        if (user == null || storedHash == null || !verified) {
            return reply(Response.Status.UNAUTHORIZED,
                    Map.of("message", "Invalid email or password."));
        }

        String token = tokens.mintAccessToken(user.getId(), List.of("user"), user.getEmail());
        return reply(Response.Status.OK, new LoginResponse(token, user.getId()));
    }

    private Response reply(Response.Status status, Object body) {
        return Response.status(status).type(MediaType.APPLICATION_JSON_TYPE)
                .header("Cache-Control", "no-store").entity(body).build();
    }
}
