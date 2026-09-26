package edu.oswego.csc480.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="people")
public class Person {

    @Column(name="person_id")
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name="user_id")
    @ManyToOne
    private User user;

    @Column(name="first_name")
    private String firstName;
    @Column(name="last_name")
    private String lastName;
    @Column(name="full_name")
    private String fullName;

    @OneToOne(mappedBy="person",cascade=CascadeType.ALL)
    private PersonAttributes attributes;

    @OneToMany(mappedBy="person", cascade=CascadeType.ALL)
    private List<Gift> gifts;

    public Person(){}

    public void setUser(User user) {
        this.user = user;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public User getUser() {
        return user;
    }

    public Integer getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public PersonAttributes getAttributes() {
        return attributes;
    }

    public void setAttributes(PersonAttributes attributes) {
        this.attributes = attributes;
    }

    public List<Gift> getGifts() {
        return gifts;
    }

    public void setGifts(List<Gift> gifts) {
        this.gifts = gifts;
    }
}
