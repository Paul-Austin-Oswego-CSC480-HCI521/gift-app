package edu.oswego.csc480.rest;

import org.junit.Test;
import javax.sql.DataSource;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import static org.junit.Assert.*;

public class DatabaseHealthTest {
    private final List<String> closed = new ArrayList<>();

    @Test
    public void successfulReadClosesAllResources() {
        assertTrue(DatabaseHealth.isConnected(source(false, true)));
        assertEquals(List.of("result", "statement", "connection"), closed);
    }

    @Test
    public void failedQueryClosesConnectionAndStatement() {
        assertFalse(DatabaseHealth.isConnected(source(true, true)));
        assertEquals(List.of("statement", "connection"), closed);
    }

    @Test
    public void emptyResultIsUnhealthy() {
        assertFalse(DatabaseHealth.isConnected(source(false, false)));
        assertEquals(List.of("result", "statement", "connection"), closed);
    }

    @Test
    public void authenticationFailureIsUnhealthy() {
        DataSource source = mock(DataSource.class, (method, args) -> {
            throw new SQLException("private connection details");
        });
        assertFalse(DatabaseHealth.isConnected(source));
    }

    private DataSource source(boolean failQuery, boolean hasRow) {
        ResultSet result = mock(ResultSet.class, (method, args) -> switch (method) {
            case "next" -> hasRow;
            case "getInt" -> 1;
            case "close" -> { closed.add("result"); yield null; }
            default -> throw new AssertionError(method);
        });
        Statement statement = mock(Statement.class, (method, args) -> switch (method) {
            case "setQueryTimeout" -> { assertEquals(5, args[0]); yield null; }
            case "executeQuery" -> {
                assertEquals("SELECT 1", args[0]);
                if (failQuery) throw new SQLException("private database details");
                yield result;
            }
            case "close" -> { closed.add("statement"); yield null; }
            default -> throw new AssertionError(method);
        });
        Connection connection = mock(Connection.class, (method, args) -> switch (method) {
            case "createStatement" -> statement;
            case "close" -> { closed.add("connection"); yield null; }
            default -> throw new AssertionError(method);
        });
        return mock(DataSource.class, (method, args) -> {
            assertEquals("getConnection", method);
            return connection;
        });
    }

    private interface Call { Object invoke(String method, Object[] args) throws Throwable; }

    private static <T> T mock(Class<T> type, Call call) {
        return type.cast(Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[]{type},
                (proxy, method, args) -> call.invoke(method.getName(), args)));
    }
}
