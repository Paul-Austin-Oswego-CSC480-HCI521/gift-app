package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="people")
public class People {

    @Column(name="person_id")
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name="user_id")
    @ManyToOne
    @JsonbTransient
    private Users user;

    @Column(name="first_name")
    private String firstName;
    @Column(name="last_name")
    private String lastName;
    @Column(name = "full_name", insertable = false, updatable = false)
    private String fullName;

    @OneToMany(mappedBy="person",cascade=CascadeType.ALL, orphanRemoval = true)
    private List<PeopleAttributes> attributes = new ArrayList<>();

    @OneToMany(mappedBy="person", cascade=CascadeType.ALL, orphanRemoval = true)
    private List<Gifts> gifts;

    public People(){}

    //get
    public Integer getId() {
        return id;
    }
    public Users getUser() {
        return user;
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
    public List<PeopleAttributes> getAttributes() {
        return attributes;
    }
    public void setAttributes(List<PeopleAttributes> attributes) {
        this.attributes = attributes;
    }
    public List<Gifts> getGifts() {
        return gifts;
    }

    //set
    public void setId(Integer id) {
        this.id = id;
    }
    public void setUser(Users user) {
        this.user = user;
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
    public void setGifts(List<Gifts> gifts) {
        this.gifts = gifts;
    }
}
