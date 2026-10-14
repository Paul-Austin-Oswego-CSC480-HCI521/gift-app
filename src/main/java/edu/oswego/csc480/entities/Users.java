package edu.oswego.csc480.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="users")
public class Users implements Serializable {

    // here are the columns

    @Id
    @Column(name="user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String surname;

    @Column(name="full_name")
    private String fullName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<UsersAttributes> attributes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade=CascadeType.ALL, orphanRemoval = true)
    private List<People> people;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserWishedItem> wishlist;

    @Column(name="email_address")
    private String email;

    @Column(name="username")
    private String username;

    public Users(){}

    //get
    public Integer getId() {
        return id;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getFullName() {
        return fullName;
    }
    public String getSurname() {
        return surname;
    }
    public List<UserWishedItem> getWishlist() {
        return wishlist;
    }
    public String getEmail() {
        return email;
    }
    public String getUsername() {
        return username;
    }
    public List<UsersAttributes> getAttributes() {
        return attributes;
    }
    public List<People> getPeople() {
        return people;
    }

    //set
    public void setId(Integer id){
        this.id = id;
    }
    public void setFirstName(String firstName){
        this.firstName = firstName;
    }
    public void setFullName(String fullName){
        this.fullName =fullName;
    }
    public void setSurname(String surname){
        this.surname = surname;
    }
    public void setWishlist(List<UserWishedItem> wishlist) {
        this.wishlist = wishlist;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setAttributes(List<UsersAttributes> attributes) {
        this.attributes = attributes;
    }
    public void setPeople(List<People> people) {
        this.people = people;
    }
}
