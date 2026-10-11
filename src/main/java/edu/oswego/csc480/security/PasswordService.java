package edu.oswego.csc480.security;

import jakarta.enterprise.context.ApplicationScoped;
import at.favre.lib.crypto.bcrypt.BCrypt;

@ApplicationScoped
public class PasswordService {
    private static final int COST = 10;

    public String hash(String password){
        char[] passwordChars = password.toCharArray();
        BCrypt.Hasher hasher = BCrypt.withDefaults();

        String hashed = hasher.hashToString(COST,passwordChars);
        return hashed;

    }

}
