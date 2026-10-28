package edu.oswego.csc480.entities;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import jakarta.json.bind.annotation.JsonbTransient;

@Entity
@Table(name="users")
public class Users implements Serializable {

    // here are the columns

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String surname;

    @Column(name = "full_name")
    private String fullName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<UsersAttributes> attributes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<People> people;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsersWishedItem> wishlist;

    @Column(name = "email_address")
    private String email;

    @Column(name = "username")
    private String username;

    // Make sure there is a dummy constructor for persistence to work
    // also getters and setters for everything.

    @JsonbTransient     //makes sure the pw hash isn't visible when api calls GET for user
    @Column(name = "password")
    private String passwordHash;

    public Users() {
    } // we can use setters anyway.

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

    public List<UsersWishedItem> getWishlist() {
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

    public String getPasswordHash() {
        return this.passwordHash;
    }

    //set
    public void setId(Integer id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setWishlist(List<UsersWishedItem> wishlist) {
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

    public void setPasswordHash (String passwordHash){
        this.passwordHash = passwordHash;
    }


}
