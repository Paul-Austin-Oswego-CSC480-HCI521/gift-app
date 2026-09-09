package edu.oswego.csc480.rest;

import jakarta.annotation.Resource;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@Path("/db")
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
