package api_shapes;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonNumber;
import jakarta.json.JsonObject;
import jakarta.json.JsonString;
import jakarta.json.JsonValue;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.annotation.JsonbTransient;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.Reader;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Keeps api-shapes.json in step with what the backend really returns.
 *
 * The frontend's mock data (Storybook stories and the Playwright fake server) is checked against the
 * same file by frontend/src/mocks/api-shapes.test.js. So a backend change fails here until the file
 * is updated, and updating the file fails the frontend test until the mocks follow.
 *
 * Each entity is filled with dummy values and serialized with a real JSON-B implementation, which is
 * what Liberty does. That way the test sees the names JSON-B really uses: a private field with no
 * getter, or one marked @JsonbTransient, is not in the response and so is not in the file.
 * Needs no server and no database.
 */
class ApiShapesTest {
    private static final String ENTITIES = "edu.oswego.csc480.entities.";
    private static final Path SHAPES_FILE = Path.of("api-shapes.json");

    /** Entity class name, as written in api-shapes.json. Add a line here when a response gets a new type. */
    private static final List<String> SHAPES = List.of(
            "User", "Person", "Gift", "GiftStatus", "Occasion", "PersonAttribute", "UserAttribute", "UserWishedItem");

    @Test
    void shapesFileMatchesWhatTheBackendReturns() throws Exception {
        JsonObject expected = readShapes();
        assertEquals(new TreeSet<>(SHAPES), new TreeSet<>(expected.keySet()),
                "api-shapes.json must describe exactly these types");

        try (Jsonb jsonb = JsonbBuilder.create()) {
            for (String name : SHAPES) {
                Object entity = filled(Class.forName(ENTITIES + name), 0);
                JsonObject actual = Json.createReader(new java.io.StringReader(jsonb.toJson(entity))).readObject();
                compare(name, expected.getJsonObject(name), actual, expected);
            }
        }
    }

    /** Fails with every difference for one type, so a developer sees the whole fix at once. */
    private static void compare(String name, JsonObject expected, JsonObject actual, JsonObject all) {
        List<String> problems = new ArrayList<>();
        collect(name, expected, actual, all, problems);
        if (!problems.isEmpty()) {
            fail("api-shapes.json differs from what the backend returns:\n  " + String.join("\n  ", problems)
                    + "\nUpdate api-shapes.json, then update the frontend mocks so frontend/src/mocks/api-shapes.test.js passes.");
        }
    }

    private static void collect(String path, JsonObject expected, JsonObject actual, JsonObject all, List<String> problems) {
        Set<String> missing = new TreeSet<>(expected.keySet());
        missing.removeAll(actual.keySet());
        Set<String> extra = new TreeSet<>(actual.keySet());
        extra.removeAll(expected.keySet());
        if (!missing.isEmpty()) problems.add(path + ": in api-shapes.json but no longer returned: " + missing);
        if (!extra.isEmpty()) problems.add(path + ": returned but not in api-shapes.json: " + extra);

        for (String key : actual.keySet()) {
            if (!expected.containsKey(key)) continue;
            String type = expected.getString(key);
            JsonValue value = actual.get(key);
            String where = path + "." + key;
            if (type.equals("string") || type.equals("number")) {
                boolean ok = type.equals("string") ? value instanceof JsonString : value instanceof JsonNumber;
                if (!ok) problems.add(where + " should be " + type + " but is " + value.getValueType());
            } else if (type.endsWith("[]") && value instanceof JsonArray array) {
                for (JsonValue item : array) collectChild(where, type.substring(0, type.length() - 2), item, all, problems);
            } else if (!type.endsWith("[]") && value instanceof JsonObject) {
                collectChild(where, type, value, all, problems);
            } else {
                problems.add(where + " should be " + type + " but is " + value.getValueType());
            }
        }
    }

    private static void collectChild(String path, String type, JsonValue value, JsonObject all, List<String> problems) {
        if (all.containsKey(type) && value instanceof JsonObject object) {
            collect(path, all.getJsonObject(type), object, all, problems);
        } else {
            problems.add(path + " names an unknown shape: " + type);
        }
    }

    private static JsonObject readShapes() throws IOException {
        assertTrue(Files.exists(SHAPES_FILE), "Run the tests from the project root: " + SHAPES_FILE.toAbsolutePath());
        try (Reader reader = Files.newBufferedReader(SHAPES_FILE)) {
            return Json.createReader(reader).readObject();
        }
    }

    /** An instance with every serialized field set, one child in every list, so JSON-B leaves nothing out. */
    private static Object filled(Class<?> type, int depth) throws Exception {
        if (depth > 6) throw new IllegalStateException("Entities nest too deeply (a cycle?) at " + type);
        Constructor<?> constructor = type.getDeclaredConstructor();
        constructor.setAccessible(true);
        Object entity = constructor.newInstance();
        for (Class<?> c = type; c != Object.class; c = c.getSuperclass()) {
            for (Field field : c.getDeclaredFields()) {
                if (Modifier.isStatic(field.getModifiers()) || field.isAnnotationPresent(JsonbTransient.class)) continue;
                field.setAccessible(true);
                field.set(entity, value(field, depth));
            }
        }
        return entity;
    }

    private static Object value(Field field, int depth) throws Exception {
        Class<?> type = field.getType();
        if (type == String.class) return "text";
        if (type == Integer.class || type == int.class) return 1;
        if (type == double.class || type == Double.class) return 1.5;
        if (type == LocalDate.class) return LocalDate.of(2099, 1, 2);
        if (type == List.class) {
            Class<?> item = (Class<?>) ((ParameterizedType) field.getGenericType()).getActualTypeArguments()[0];
            return new ArrayList<>(List.of(filled(item, depth + 1)));
        }
        if (type.getName().startsWith(ENTITIES)) return filled(type, depth + 1);
        throw new IllegalStateException("ApiShapesTest does not know how to fill " + field + ". Add a case for " + type);
    }
}
