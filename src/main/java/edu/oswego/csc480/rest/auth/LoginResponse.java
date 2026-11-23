package edu.oswego.csc480.rest.auth;

public class LoginResponse {
    private final Integer userId;

    public LoginResponse(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return userId;
    }
}
