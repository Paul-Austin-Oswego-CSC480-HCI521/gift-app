package edu.oswego.csc480.utils.auth;


import com.ibm.websphere.security.jwt.JwtBuilder;
import edu.oswego.csc480.rest.gift_service.UsersAttributesResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class JwtService {

    private static JwtService instance;

    private JwtService(){
    }

    private Logger log = LoggerFactory.getLogger(UsersAttributesResource.class);

    public static JwtService getInstance(){
        if (instance == null){
            instance = new JwtService();
            LoggerFactory.getLogger(JwtService.class).info("JwtService started successfully");
        }
        return instance;
    }

    public String mintAccessToken(int uid, List<String> roles, String email){
        try{
            log.info("Token for user {} is being minted.", uid);
            JwtBuilder builder = JwtBuilder.create("myBuilder");
            return builder
                    .subject(Integer.toString(uid))
                    .claim("upn", email)
                    .claim("groups", roles)
                    .buildJwt()
                    .compact();
        } catch (Exception e){
            log.error("Jwt service fauled to create a JWT builder.", e);
            throw new RuntimeException("Failed to create JWT builder.", e);
        }
    }
    public String mintLongerAccessToken(int uid, List<String> roles, String email){
        long days3 = 3L * 24 * 60 * 60 + (System.currentTimeMillis()/1000);
        try{
            JwtBuilder builder = JwtBuilder.create("myBuilder");
            log.info("Long Token for user {} is being minted.", uid);
            return builder
                    .subject(Integer.toString(uid))
                    .claim("upn", email)
                    .claim("groups", roles)
                    .expirationTime(days3)
                    .buildJwt()
                    .compact();
        } catch (Exception e){
            log.error("Jwt service fauled to create a JWT builder.", e);
            throw new RuntimeException("Failed to create JWT builder.", e);
        }
    }

}
