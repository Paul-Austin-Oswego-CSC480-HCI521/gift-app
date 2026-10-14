package edu.oswego.csc480.utils.auth;


import com.ibm.websphere.security.jwt.JwtBuilder;
import java.util.List;

public class JwtService {

    private static JwtService instance;

    private JwtService(){
    }

    public static JwtService getInstance(){
        if (instance == null){
            instance = new JwtService();
        }
        return instance;
    }

    public String mintAccessToken(int uid, List<String> roles){
        try{
            JwtBuilder builder = JwtBuilder.create("myBuilder");
            return builder
                    .subject(Integer.toString(uid))
                    .claim("upn", Integer.toString(uid))
                    .claim("groups", roles)
                    .buildJwt()
                    .compact();
        } catch (Exception e){
            throw new RuntimeException("Failed to create JWT builder.", e);
        }
    }



}
