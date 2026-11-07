package edu.oswego.csc480.rest.auth;

import edu.oswego.csc480.entities.User;
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
import jakarta.ws.rs.core.UriBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@Path("/auth")
@RequestScoped
@PermitAll
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {
    private static final String DUMMY_HASH = new PasswordService().hash("dummy-password");
    private static final int MIN_PASSWORD_LENGTH= 6;

    @Inject
    private UserRepository uRepo;

    @Inject
    private PasswordService passwords;

    private JwtService tokens = JwtService.getInstance();

    private Logger log = LoggerFactory.getLogger(AuthResource.class);

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        if (request == null || request.email == null || request.email.isBlank()
                || request.password == null || request.password.isEmpty()) {
            log.debug("Request form invalid.");
            return reply(Response.Status.BAD_REQUEST,
                    Map.of("message", "Email and password are required."));
        }

        User user = uRepo.findByEmail(request.email.strip()).orElse(null);
        String storedHash = user == null ? null : user.getPasswordHash();
        String hashToVerify = storedHash == null ? DUMMY_HASH : storedHash;
        boolean verified;
        try {
            if (user != null && user.getId() != null){
                log.info("Auth request for user {} has been received.", user.getId());
            }

            verified = passwords.verify(request.password, hashToVerify);
        } catch (IllegalArgumentException invalidHashOrPassword) {
            log.error("Invalid hash or password.", invalidHashOrPassword);
            verified = false;
        }

        if (user == null || storedHash == null || !verified) {
            log.info("Auth request failed. email: {}", request.email);
            return reply(Response.Status.UNAUTHORIZED,
                    Map.of("message", "Invalid email or password."));
        }

        String token = tokens.mintAccessToken(user.getId(), List.of("user"), user.getEmail());
        log.info("Auth Request successful for user {}.", user.getId());
        return reply(Response.Status.OK, new LoginResponse(token, user.getId()));
    }

    @POST
    @Path("/signup")
    public Response signup(SignupForm form){
        log.info("Request to create user");
        User user;
        if (form == null
                || form.email == null || form.email.isBlank()
                || form.firstName == null || form.firstName.isBlank()
                || form.password == null || form.password.isBlank()
                || form.surname == null || form.surname.isBlank()
                || form.username == null || form.username.isBlank()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        user = new User();
        user.setFirstName(form.firstName);
        user.setSurname(form.surname);
        user.setEmail(form.email);
        user.setUsername(form.username);

        try{
            String passwordHash = passwords.hash(form.password);
            user.setPasswordHash(passwordHash);
        } catch(IllegalArgumentException e){
            log.error("password does not meet password service requirements.", e);
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        user = uRepo.save(user);
        String token = tokens.mintAccessToken(user.getId(), List.of("user"), user.getEmail());
        LoginResponse tokenObject = new LoginResponse(token, user.getId());
        return Response.created(UriBuilder.fromPath("user/" + user.getId()).build()).entity(tokenObject).build();
    }

    private Response reply(Response.Status status, Object body) {
        return Response.status(status).type(MediaType.APPLICATION_JSON_TYPE)
                .header("Cache-Control", "no-store").entity(body).build();
    }

    public record SignupForm(String firstName, String surname,
                              String email, String username,
                              String password){};

}
