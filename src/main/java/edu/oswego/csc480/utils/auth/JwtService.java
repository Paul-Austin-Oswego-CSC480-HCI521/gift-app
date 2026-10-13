package edu.oswego.csc480.utils.auth;

import java.security.PrivateKey;

public class JwtService {

    private static JwtService instance;

    private PrivateKey key;

    private JwtService(){
    }

    public static JwtService getInstance(){
        if (instance == null) instance = new JwtService();
        return instance;
    }

    public void init(String privateKeyPath){
        //get the key from file
    }



}
