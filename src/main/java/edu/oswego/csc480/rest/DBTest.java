package edu.oswego.csc480.rest;

import edu.oswego.csc480.entities.TestEntity;
import edu.oswego.csc480.repositories.TestRepository;
import jakarta.annotation.Resource;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Optional;

@Path("/db")
public class DBTest {

    @Resource(lookup = "jdbc/giftapp")
    DataSource dataSource;

    @Inject
    TestRepository trepo;

    @Path("/persistence")
    @GET
    public TestEntity EclipseLinkTest(){

        Optional<TestEntity> entity = trepo.findById(1);

        if (entity.isEmpty()){
            return null;
        }else{
            return entity.get();
        }
    }

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
