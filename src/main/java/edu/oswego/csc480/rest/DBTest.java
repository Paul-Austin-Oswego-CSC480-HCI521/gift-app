package edu.oswego.csc480.rest;

import jakarta.annotation.Resource;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Optional;

@Path("/db")
@Produces(MediaType.APPLICATION_JSON)
public class DBTest {

    @Resource(lookup = "jdbc/giftapp")
    DataSource dataSource;



    @GET
    public String test() throws Exception {
        Connection connection = dataSource.getConnection();
        Statement statement = connection.createStatement();

        ResultSet results = statement.executeQuery("SELECT * FROM users");
        StringBuilder output = new StringBuilder();

        while(results.next()) {
            output.append(results.getInt("user_id"))
                    .append(" - ")
                    .append(results.getString("full_name"))
                    .append("\n");
        }

        connection.close();

        return output.toString();
    }
}
