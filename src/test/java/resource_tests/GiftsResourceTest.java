package resource_tests;

import edu.oswego.csc480.entities.GiftStatus;
import edu.oswego.csc480.entities.Gifts;
import edu.oswego.csc480.entities.People;
import edu.oswego.csc480.entities.Users;
import edu.oswego.csc480.repositories.UserRepository;
import edu.oswego.csc480.rest.gift_service.GiftsResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GiftsResourceTest {
  private UserRepository userRepository;
  private GiftsResource resource;

  @BeforeEach
  public void setUp() throws Exception {
    userRepository = mock(UserRepository.class);
    resource = new GiftsResource();
    
    java.lang.reflect.Field repoField = 
        GiftsResource.class.getDeclaredField("uRepo");
    repoField.setAccessible(true);
    repoField.set(resource, userRepository);
    
    java.lang.reflect.Field field = 
      GiftsResource.class.getDeclaredField("uid");
    field.setAccessible(true);
    field.set(resource, 1);
  }

  //GET gifts tests
  //GET all gifts for one user
  @Test
  public void getAllGifts_200() {
    Users user = new Users();

    People person1 = new People();
    person1.setId(1);
    
    People person2 = new People();
    person2.setId(2);
    
    ArrayList<People> people = new ArrayList<>();
    people.add(person1);
    people.add(person2);
    user.setPeople(people);

    Gifts gift1 = new Gifts();
    gift1.setId(1);
    Gifts gift2 = new Gifts();
    gift2.setId(2);
    Gifts gift3 = new Gifts();
    gift3.setId(3);

    ArrayList<Gifts> gifts1 = new ArrayList<>();
    gifts1.add(gift1);
    gifts1.add(gift2);
    ArrayList<Gifts> gifts2 = new ArrayList<>();
    gifts2.add(gift3);
    
    person1.setGifts(gifts1);
    person2.setGifts(gifts2);
    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.getEveryGiftFromUser();
    assertEquals(200, response.getStatus());
    ArrayList<Gifts> expectedGifts = new ArrayList<>();
    expectedGifts.add(gift1);
    expectedGifts.add(gift2);
    expectedGifts.add(gift3);

    assertEquals(expectedGifts, response.getEntity());
    verify(userRepository).findById(1);
  }

  //GET all gifts, 404, user entity does not exist
  @Test
  public void getAllGifts_404_1() {
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.getEveryGiftFromUser();
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
  }

  //GET all gifts, 200, person entity does not exist, returns empty list
  @Test
  public void getAllGifts_200_2() {
    Users user = new Users();
    user.setPeople(new ArrayList<>());
    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.getEveryGiftFromUser();
    assertEquals(200, response.getStatus());
    assertEquals(new ArrayList<Gifts>(), response.getEntity());
    verify(userRepository).findById(1);
  }

  //GET all gifts from a specific person 200 success
  @Test
  public void getAllGifts_OnePerson_200() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    Gifts gift1 = new Gifts();
    gift1.setId(10);
    Gifts gift2 = new Gifts();
    gift2.setId(20);

    ArrayList<Gifts> gifts = new ArrayList<>();
    gifts.add(gift1);
    gifts.add(gift2);
    person.setGifts(gifts);

    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.getEveryGiftFromSpecificPerson(1);
    assertEquals(200, response.getStatus());
    assertEquals(gifts, response.getEntity());
    verify(userRepository).findById(1);
  }

  //GET all gifts from one person, 404, user entity does not exist
  @Test
  public void getAllGifts_OnePerson_404_1() {
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.getEveryGiftFromSpecificPerson(1);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
  }

  //GET all gifts from one person 404, person entity does not exist
  @Test
  public void getAllGifts_OnePerson_404_2() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);
    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.getEveryGiftFromSpecificPerson(999);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
  }

  //GET single gift tests
  //GET single gift, 200 success
  @Test
  public void getOneGift_200() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    Gifts gift1 = new Gifts();
    gift1.setId(10);
    Gifts gift2 = new Gifts();
    gift2.setId(20);

    ArrayList<Gifts> gifts = new ArrayList<>();
    gifts.add(gift1);
    gifts.add(gift2);
    person.setGifts(gifts);

    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.getGiftDirect(10);

    assertEquals(200, response.getStatus());
    assertEquals(gift1, response.getEntity());
    verify(userRepository).findById(1);
  }

  //GET single gift, 404, user entity does not exist
  @Test
  public void getOneGift_404_1() {
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.getGiftDirect(10);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
  }

  //GET single gift, 404, gift entity does not exist
  @Test 
  public void getOneGift_404_2() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    Gifts gift = new Gifts();
    gift.setId(10);
    ArrayList<Gifts> gifts = new ArrayList<>();
    gifts.add(gift);
    person.setGifts(gifts);
    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.getGiftDirect(999);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
  }

  //CREATE gift tests
  //CREATE gift, 201 success
  @Test
  public void createGift_201() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    person.setGifts(new ArrayList<>());

    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    Gifts gift = new Gifts();
    gift.setId(10);
    gift.setName("Phone");
    gift.setType("Electronics");
    gift.setStatus(new GiftStatus());

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenReturn(user);

    Response response = resource.postNewGiftToPerson(1, gift);
    assertEquals(201, response.getStatus());
    assertTrue(person.getGifts().contains(gift));
    assertEquals(person, gift.getPerson());
    verify(userRepository).findById(1);
    verify(userRepository).save(user);
  }

  //CREATE gift, 400, no gift entity passed
  @Test
  public void createGift_400_1() {
    Response response = resource.postNewGiftToPerson(1, null);
    assertEquals(400, response.getStatus());
    verify(userRepository, never()).findById(any());
    verify(userRepository, never()).save(any(Users.class));
  }

  //CREATE gift, 400, no fields passed
  @Test
  public void createGift_400_2() {
    Gifts gift = new Gifts();
    gift.setName("Phone");
    gift.setType("Electronics");

    Response response = resource.postNewGiftToPerson(1, gift);
    assertEquals(400, response.getStatus());
    verify(userRepository, never()).findById(any());
    verify(userRepository, never()).save(any(Users.class));
  }

  //CREATE gift, 404, user entity does not exist
  @Test
  public void createGift_404() {
    Gifts gift = new Gifts();
    gift.setName("Phone");
    gift.setType("Electronics");
    gift.setStatus(new GiftStatus());

    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.postNewGiftToPerson(1, gift);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //UPDATE gift tests
  //UPDATE existing gift, 204 success
  @Test
  public void updateGift_204() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    Gifts existingGift = new Gifts();
    existingGift.setId(10);
    existingGift.setPerson(person);

    ArrayList<Gifts> gifts = new ArrayList<>();
    gifts.add(existingGift);
    person.setGifts(gifts);
    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    Gifts updatedGift = new Gifts();
    updatedGift.setName("Updated phone");
    updatedGift.setType("Electronics");

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenReturn(user);

    Response response = resource.updateGiftDirect(10, updatedGift);
    assertEquals(204, response.getStatus());
    assertEquals(10, updatedGift.getId());
    assertEquals(person, updatedGift.getPerson());
    assertFalse(person.getGifts().contains(existingGift));
    assertTrue(person.getGifts().contains(updatedGift));
    verify(userRepository).findById(1);
    verify(userRepository).save(user);
  }

  //UPDATE existing gift, 404, user entity does not exist
  @Test
  public void updateGift_404_1() {
    Gifts gift = new Gifts();
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.updateGiftDirect(10, gift);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //UPDATE existing gift, 404, selected gift entity does not exist
  @Test
  public void updateGift_404_2() {
    Users user = new Users();
    user.setPeople(new ArrayList<>());
    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.updateGiftDirect(999, new Gifts());
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //DELETE single gift tests
  //DELETE existing gift, 204 success
  @Test
  public void deleteGift_204() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    Gifts gift = new Gifts();
    gift.setId(10);

    ArrayList<Gifts> gifts = new ArrayList<>();
    gifts.add(gift);
    person.setGifts(gifts);

    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenReturn(user);

    Response response = resource.deleteGift(10);
    assertEquals(204, response.getStatus());
    assertFalse(person.getGifts().contains(gift));
    verify(userRepository).findById(1);
    verify(userRepository).save(user);
  }

  //DELETE existing gift, 404, user entity does not exist
  @Test
  public void deleteGift_404_1() {
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.deleteGift(10);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //DELETE existing gift, 404, gift does not exist
  @Test
  public void deleteGift_404_2() {
    Users user = new Users();
    user.setPeople(new ArrayList<>());
    when(userRepository.findById(1)).thenReturn(Optional.of(user));

    Response response = resource.deleteGift(999);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //DELETE all gifts tests
  //DELETE all gifts from a user, 204 success
  @Test
  public void deleteAllGifts_204() {
    Users user = new Users();
    People person = new People();
    person.setId(1);
    Gifts gift1 = new Gifts();
    gift1.setId(10);
    Gifts gift2 = new Gifts();
    gift2.setId(12);

    ArrayList<Gifts> gifts = new ArrayList<>();
    gifts.add(gift1);
    gifts.add(gift2);
    person.setGifts(gifts);

    ArrayList<People> people = new ArrayList<>();
    people.add(person);
    user.setPeople(people);

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenReturn(user);

    Response response = resource.nukeItAll();

    assertEquals(204, response.getStatus());
    assertTrue(person.getGifts().isEmpty());
    verify(userRepository).findById(1);
    verify(userRepository).save(user);
  }

  //DELETE all gifts for user 404
  @Test
  public void deleteAllGifts_404() {
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.nukeItAll();
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //DELETE all gifts for one person
  //DELETE all gifts for one person, 204 success
  @Test
  public void deletePersonGifts() {
    Users user = new Users();
    People person1 = new People();
    person1.setId(1);
    People person2 = new People();
    person2.setId(2);
    Gifts gift1 = new Gifts();
    Gifts gift2 = new Gifts();
    Gifts gift3 = new Gifts();
    gift1.setId(10);
    gift2.setId(20);
    gift3.setId(30);
    ArrayList<Gifts> p1_gifts = new ArrayList<>();
    p1_gifts.add(gift1);
    p1_gifts.add(gift2);
    ArrayList<Gifts> p2_gifts = new ArrayList<>();
    p2_gifts.add(gift3);
    ArrayList<People> people = new ArrayList<>();
    people.add(person1);
    people.add(person2);
    person1.setGifts(p1_gifts);
    person2.setGifts(p2_gifts);
    user.setPeople(people);

    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    when(userRepository.save(user)).thenReturn(user);

    Response response = resource.charcoal(1);

    assertEquals(204, response.getStatus());
    assertTrue(person1.getGifts().isEmpty());
    assertFalse(person2.getGifts().isEmpty());
    verify(userRepository).findById(1);
    verify(userRepository).save(user);
  }

  //DELETE all gifts for one person, 404, user entity does not exist
  @Test
  public void deletePersonGifts_404_1() {
    when(userRepository.findById(1)).thenReturn(Optional.empty());
    Response response = resource.charcoal(1);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }

  //DELETE all gifts for one person, 404, person entity does not exist
  @Test
  public void deletePersonGifts_404_2() {
    Users user = new Users();
    user.setPeople(new ArrayList<>());
    when(userRepository.findById(1)).thenReturn(Optional.of(user));
    Response response = resource.charcoal(999);
    assertEquals(404, response.getStatus());
    verify(userRepository).findById(1);
    verify(userRepository, never()).save(any(Users.class));
  }
}

