package edu.oswego.csc480.rest;

import jakarta.annotation.Resource;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import javax.sql.DataSource;
import java.sql.SQLException;

@Path("/db/health")
@Produces(MediaType.APPLICATION_JSON)
public class DatabaseHealth {
    @Resource(lookup = "jdbc/giftapp")
    DataSource dataSource;

    @GET
    public Response health() {
        boolean connected = isConnected(dataSource);
        return Response.status(connected ? 200 : 503)
                .header("Cache-Control", "no-store")
                .entity(connected ? "{\"status\":\"UP\"}" : "{\"status\":\"DOWN\"}")
                .build();
    }

    static boolean isConnected(DataSource source) {
        try (var connection = source.getConnection();
             var statement = connection.createStatement()) {
            statement.setQueryTimeout(5);
            try (var result = statement.executeQuery("SELECT 1")) {
                return result.next() && result.getInt(1) == 1;
            }
        } catch (SQLException exception) {
            // Connection details and credentials must never appear in the response.
            return false;
        }
    }
}
