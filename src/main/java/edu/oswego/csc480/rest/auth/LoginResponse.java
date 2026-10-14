package edu.oswego.csc480.rest.auth;

public class LoginResponse {
    private final String token;
    private final Integer userId;

    public LoginResponse(String token, Integer userId) {
        this.token = token;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public Integer getUserId() {
        return userId;
    }
}
