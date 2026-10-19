package auth_contract;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.util.JSONObjectUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/** Opt-in tests against a real Liberty instance; no database writes or mocked JWTs. */
@EnabledIfSystemProperty(named = "auth.contract", matches = "true")
class AuthEndpointIT {
    private static final HttpClient CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).followRedirects(HttpClient.Redirect.NEVER).build();
    private static String base, email, password, userId, issuer;
    private static URI jwks;

    @BeforeAll
    static void configuration() {
        base = required("AUTH_TEST_BASE_URL").replaceAll("/+$", "");
        email = required("AUTH_TEST_EMAIL");
        password = required("AUTH_TEST_PASSWORD");
        userId = required("AUTH_TEST_USER_ID");
        assertTrue(userId.matches("[0-9]+"), "AUTH_TEST_USER_ID must be numeric");
        issuer = required("AUTH_TEST_ISSUER");
        jwks = URI.create(required("AUTH_TEST_JWKS_URL"));
        validateTransport(URI.create(base));
        validateTransport(jwks);
    }

    private static void validateTransport(URI uri) {
        boolean local = Set.of("localhost", "127.0.0.1", "[::1]", "::1").contains(uri.getHost() == null ? "" : uri.getHost());
        assertTrue("https".equals(uri.getScheme()) || (local && "http".equals(uri.getScheme())),
                "Use HTTPS, except for local loopback testing");
        assertNull(uri.getUserInfo(), "Do not put credentials in URLs");
        assertNull(uri.getQuery(), "Do not put credentials in URL queries");
    }

    @Test
    void successfulLoginIssuesVerifiableToken() throws Exception {
        HttpResponse<String> response = login(credentials(email, password));
        assertEquals(200, response.statusCode());
        assertJsonNoStore(response);
        Map<String, Object> body = JSONObjectUtils.parse(response.body());
        assertEquals(Set.of("token", "userId"), body.keySet(), "Login response must not expose user/password fields");
        assertEquals(userId, String.valueOf(body.get("userId")));
        assertTrue(body.get("token") instanceof String && !((String) body.get("token")).isBlank());

        String token = (String) body.get("token");
        SignedJWT jwt = SignedJWT.parse(token);
        assertEquals(JWSAlgorithm.RS256, jwt.getHeader().getAlgorithm());
        HttpResponse<String> keys = send(HttpRequest.newBuilder(jwks).GET());
        assertEquals(200, keys.statusCode(), "Configured trusted JWKS must be reachable");
        // Use only configured trusted keys, never a URL supplied by the token.
        boolean verified = false;
        for (JWK key : JWKSet.parse(keys.body()).getKeys()) {
            if (key instanceof RSAKey rsa && (jwt.getHeader().getKeyID() == null
                    || jwt.getHeader().getKeyID().equals(key.getKeyID()))) {
                verified |= jwt.verify(new RSASSAVerifier(rsa.toRSAPublicKey()));
            }
        }
        assertTrue(verified, "Issued token must verify against the trusted JWKS");
        JWTClaimsSet claims = jwt.getJWTClaimsSet();
        assertEquals(issuer, claims.getIssuer());
        assertEquals(userId, claims.getSubject());
        assertEquals(email, claims.getStringClaim("upn"));
        assertTrue(claims.getStringListClaim("groups").contains("user"));
        assertNotNull(claims.getIssueTime());
        assertNotNull(claims.getExpirationTime());
        assertTrue(claims.getExpirationTime().toInstant().isAfter(Instant.now()));
        assertTrue(claims.getExpirationTime().after(claims.getIssueTime()));
        assertTrue(claims.getIssueTime().toInstant().isBefore(Instant.now().plusSeconds(60)));
        assertNotNull(claims.getJWTID(), "MP-JWT requires a token identifier");

        assertEquals(200, protectedRequest(token).statusCode(), "Liberty must accept its issued token");
        assertEquals(401, protectedRequest(null).statusCode(), "Protected endpoint must reject missing tokens");
        String[] parts = token.split("\\.");
        byte[] signature = Base64.getUrlDecoder().decode(parts[2]);
        signature[0] ^= 1;
        String tampered = parts[0] + "." + parts[1] + "."
                + Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        assertEquals(401, protectedRequest(tampered).statusCode(), "Liberty must reject a modified signature");
    }

    @Test
    void invalidCredentialsHaveIdentical401Responses() throws Exception {
        String wrongPassword = password.equals("invalid-contract-password") ? "different-contract-password" : "invalid-contract-password";
        HttpResponse<String> wrong = login(credentials(email, wrongPassword));
        HttpResponse<String> unknown = login(credentials("missing-" + java.util.UUID.randomUUID() + "@example.invalid", password));
        for (HttpResponse<String> response : java.util.List.of(wrong, unknown)) {
            assertEquals(401, response.statusCode());
            assertJsonNoStore(response);
            assertEquals(Map.of("message", "Invalid email or password."), JSONObjectUtils.parse(response.body()));
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"{", "[]", "{\"email\":", "{\"email\":{},\"password\":[]}"})
    void malformedJsonReturns400(String payload) throws Exception {
        assertEquals(400, login(payload).statusCode(), "Malformed JSON must be rejected by the HTTP/JSON layer");
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "null", "{\"email\":\"\",\"password\":\"x\"}", "{\"email\":\"x@example.invalid\"}"})
    void missingFieldsReturn400(String payload) throws Exception {
        HttpResponse<String> response = login(payload);
        assertEquals(400, response.statusCode());
        assertJsonNoStore(response);
        assertEquals(Map.of("message", "Email and password are required."), JSONObjectUtils.parse(response.body()));
    }

    private static String credentials(String address, String secret) {
        return JSONObjectUtils.toJSONString(Map.of("email", address, "password", secret));
    }

    private static HttpResponse<String> login(String payload) throws Exception {
        return send(HttpRequest.newBuilder(URI.create(base + "/auth/login"))
                .header("Content-Type", "application/json").header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload)));
    }

    private static HttpResponse<String> protectedRequest(String token) throws Exception {
        HttpRequest.Builder request = HttpRequest.newBuilder(URI.create(base + "/user/" + userId)).GET();
        if (token != null) request.header("Authorization", "Bearer " + token);
        return send(request);
    }

    private static HttpResponse<String> send(HttpRequest.Builder request) throws Exception {
        return CLIENT.send(request.timeout(Duration.ofSeconds(20)).build(), HttpResponse.BodyHandlers.ofString());
    }

    private static void assertJsonNoStore(HttpResponse<String> response) {
        assertTrue(response.headers().firstValue("Content-Type").orElse("").startsWith("application/json"));
        assertEquals("no-store", response.headers().firstValue("Cache-Control").orElse(""));
    }

    private static String required(String name) {
        String value = System.getenv(name);
        assertTrue(value != null && !value.isBlank(), "Set " + name + " before running -Pauth-contract");
        return value;
    }
}
