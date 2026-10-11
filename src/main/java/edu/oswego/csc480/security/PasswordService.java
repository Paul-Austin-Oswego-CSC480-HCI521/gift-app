package edu.oswego.csc480.security;

import jakarta.enterprise.context.ApplicationScoped;
import at.favre.lib.crypto.bcrypt.BCrypt;

@ApplicationScoped
public class PasswordService {
    private static final int COST = 10;
    private static final int MIN_PASSWORD_LENGTH= 6;

    public String hash(String password){
        if (password == null || password.length() < MIN_PASSWORD_LENGTH){
            throw new IllegalArgumentException("Passwords must be at least " +  MIN_PASSWORD_LENGTH + " characters long");
        }
        char[] passwordChars = password.toCharArray();
        BCrypt.Hasher hasher = BCrypt.withDefaults();

        String hashed = hasher.hashToString(COST,passwordChars);
        return hashed;

    }

    public boolean verify (String plainText,  String storedHash){
        if(plainText == null || storedHash == null){
            return false;
        }

        char[] plainTextChar = plainText.toCharArray();

        BCrypt.Result result = BCrypt.verifyer().verify(plainTextChar, storedHash);

        return result.verified;

    }

}
