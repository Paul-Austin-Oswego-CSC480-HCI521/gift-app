package edu.oswego.csc480.security;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordServiceTest {

    private final PasswordService passwordService = new PasswordService();

    @Test
    public void verify_correct_password_returns_True(){
        String stored = passwordService.hash("test123");

        boolean result = passwordService.verify("test123", stored);

        assertTrue(result);
    }

    @Test
    public void verify_incorrect_password_returns_False(){
        String stored = passwordService.hash("test123");

        boolean result = passwordService.verify("test124", stored);

        assertFalse(result);
    }

    @Test
    public void password_too_short_ThrowsException(){

        assertThrows(IllegalArgumentException.class, () -> {
            passwordService.hash("test1");
        });

    }

    @Test
    public void password_hashed_twice_returns_Not_Equal(){
        String pw1 = passwordService.hash("test123");
        String pw2 = passwordService.hash("test123");

        assertNotEquals(pw1, pw2);

    }

    @Test
    public void password_is_null_ThrowsException(){
        assertThrows(IllegalArgumentException.class, () -> {
            passwordService.hash(null);
        });
    }

    @Test
    public void verify_stored_password_being_null_return_false(){

        String plainText = "test123";

        boolean result = passwordService.verify(plainText, null);
        assertFalse(result);


    }

    @Test
    public void exactly_6_characters_returns_true(){

        String pw1 = passwordService.hash("test12");

        boolean result = passwordService.verify("test12", pw1);

        assertTrue(result);
    }


}

