package resource_tests;

import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.auth.AuthResource;
import edu.oswego.csc480.rest.auth.LoginRequest;
import edu.oswego.csc480.rest.auth.LoginResponse;
import edu.oswego.csc480.security.PasswordService;
import edu.oswego.csc480.utils.auth.JwtService;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthResourceTest {
    private static final String EMAIL = "login@example.test";
    private static final String PASSWORD = "login-test-password";
    private static final String INVALID_CREDENTIALS = "Invalid email or password.";
    private String passwordHash;

    private UserRepository users;
    private PasswordService passwords;
    private JwtService tokens;
    private AuthResource resource;
    private Users user;

    @BeforeEach
    public void setUp() throws Exception {
        users = mock(UserRepository.class);
        PasswordService service = new PasswordService();
        passwordHash = service.hash(PASSWORD);
        passwords = spy(service);
        tokens = mock(JwtService.class);
        resource = new AuthResource();
        inject("users", users);
        inject("passwords", passwords);
        inject("tokens", tokens);

        user = new Users();
        user.setId(42);
        user.setEmail(EMAIL);
        user.setPasswordHash(passwordHash);
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user));
    }

    @Test
    public void login_nullRequest_400() {
        assertError(resource.login(null), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_nullEmail_400() {
        assertError(resource.login(request(null, PASSWORD)), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_emptyEmail_400() {
        assertError(resource.login(request("", PASSWORD)), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_blankEmail_400() {
        assertError(resource.login(request("   ", PASSWORD)), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_nullPassword_400() {
        assertError(resource.login(request(EMAIL, null)), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_emptyPassword_400() {
        assertError(resource.login(request(EMAIL, "")), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_emptyRequest_400() {
        assertError(resource.login(new LoginRequest()), 400, "Email and password are required.");
        verifyNoInteractions(users, passwords, tokens);
    }

    @Test
    public void login_unknownEmail_401() {
        String unknownEmail = "unknown@example.test";
        when(users.findByEmail(unknownEmail)).thenReturn(Optional.empty());

        assertError(resource.login(request(unknownEmail, PASSWORD)), 401, INVALID_CREDENTIALS);

        verify(users).findByEmail(unknownEmail);
        verify(passwords).verify(eq(PASSWORD), anyString());
        verifyNoInteractions(tokens);
    }

    @Test
    public void login_wrongPassword_401() {
        assertError(resource.login(request(EMAIL, "incorrect-password")), 401, INVALID_CREDENTIALS);

        verify(passwords).verify("incorrect-password", passwordHash);
        verifyNoInteractions(tokens);
    }

    @Test
    public void login_missingStoredHash_401() {
        user.setPasswordHash(null);

        assertError(resource.login(request(EMAIL, PASSWORD)), 401, INVALID_CREDENTIALS);

        verify(passwords).verify(eq(PASSWORD), anyString());
        verifyNoInteractions(tokens);
    }

    @Test
    public void login_emptyStoredHash_401() {
        user.setPasswordHash("");

        assertError(resource.login(request(EMAIL, PASSWORD)), 401, INVALID_CREDENTIALS);

        verify(passwords).verify(PASSWORD, "");
        verifyNoInteractions(tokens);
    }

    @Test
    public void login_malformedStoredHash_401() {
        user.setPasswordHash("not-a-bcrypt-hash");

        assertError(resource.login(request(EMAIL, PASSWORD)), 401, INVALID_CREDENTIALS);

        verify(passwords).verify(PASSWORD, "not-a-bcrypt-hash");
        verifyNoInteractions(tokens);
    }

    @Test
    public void login_passwordVerificationException_401() {
        doThrow(new IllegalArgumentException("Invalid stored hash"))
                .when(passwords).verify(PASSWORD, passwordHash);

        assertError(resource.login(request(EMAIL, PASSWORD)), 401, INVALID_CREDENTIALS);

        verifyNoInteractions(tokens);
    }

    @Test
    public void login_validCredentials_200() {
        when(tokens.mintAccessToken(42, List.of("user"), EMAIL)).thenReturn("test-token");

        try (Response response = resource.login(request(EMAIL, PASSWORD))) {
            assertEquals(200, response.getStatus());
            LoginResponse result = assertInstanceOf(LoginResponse.class, response.getEntity());
            NewCookie cookie = response.getCookies().get("gift_access_token");
            assertNotNull(cookie);
            assertEquals("test-token", cookie.getValue());
            assertTrue(cookie.isHttpOnly());
            assertTrue(cookie.isSecure());
            assertEquals(NewCookie.SameSite.STRICT, cookie.getSameSite());
            assertEquals("/", cookie.getPath());
            assertNull(cookie.getDomain());
            assertEquals(NewCookie.DEFAULT_MAX_AGE, cookie.getMaxAge());
            assertEquals(Integer.valueOf(42), result.getUserId());
            assertEquals(MediaType.APPLICATION_JSON_TYPE, response.getMediaType());
            assertEquals("no-store", response.getHeaderString("Cache-Control"));
        }

        verify(users).findByEmail(EMAIL);
        verify(passwords).verify(PASSWORD, passwordHash);
        verify(tokens).mintAccessToken(42, List.of("user"), EMAIL);
    }

    private void inject(String name, Object value) throws Exception {
        Field field = AuthResource.class.getDeclaredField(name);
        field.setAccessible(true);
        field.set(resource, value);
    }

    private static LoginRequest request(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.email = email;
        request.password = password;
        return request;
    }

    private static void assertError(Response response, int status, String message) {
        try (response) {
            assertEquals(status, response.getStatus());
            assertEquals(Map.of("message", message), response.getEntity());
            assertEquals(MediaType.APPLICATION_JSON_TYPE, response.getMediaType());
            assertEquals("no-store", response.getHeaderString("Cache-Control"));
        }
    }
}
