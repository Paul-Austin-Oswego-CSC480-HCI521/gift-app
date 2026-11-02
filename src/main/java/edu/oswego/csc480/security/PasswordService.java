package edu.oswego.csc480.security;

import edu.oswego.csc480.utils.auth.JwtService;
import jakarta.enterprise.context.ApplicationScoped;
import at.favre.lib.crypto.bcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class PasswordService {
    private static final int COST = 10;
    private static final int MIN_PASSWORD_LENGTH= 6;

    private Logger log = LoggerFactory.getLogger(PasswordService.class);

    public String hash(String password){
        log.info("hashing password...");
        if (password == null || password.length() < MIN_PASSWORD_LENGTH){
            IllegalArgumentException e = new IllegalArgumentException("Passwords must be at least "
                    +  MIN_PASSWORD_LENGTH + " characters long");
            log.error("an error has occurred during hashing", e);
            throw e;
        }
        char[] passwordChars = password.toCharArray();
        BCrypt.Hasher hasher = BCrypt.withDefaults();
        String hashed = hasher.hashToString(COST,passwordChars);
        log.info("password hashed successfully");
        return hashed;

    }

    public boolean verify (String plainText,  String storedHash){
        if(plainText == null || storedHash == null){
            log.debug("Verify called with either no plain text nor hash.");
            return false;
        }

        char[] plainTextChar = plainText.toCharArray();

        BCrypt.Result result = BCrypt.verifyer().verify(plainTextChar, storedHash);
        log.info("password verified");
        return result.verified;

    }

}
