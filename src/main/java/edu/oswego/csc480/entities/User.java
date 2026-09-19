package edu.oswego.csc480.entities;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="users")
public class User implements Serializable {

    // here are the columns

    @Id
    @Column(name="user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer uid;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String surname;

    @Column(name="full_name")
    private String fullName; // could instead be managed by a function?

    // Make sure there is a dummy constructor for persistence to work
    // also getters and setters for everything.

    public User(){} // we can use setters anyway.

    public void setUid(Integer uid){
        this.uid = uid;
    }

    public void setFirstName(String firstName){
        this.firstName = firstName;
    }

    public void setSurname(String surname){
        this.surname = surname;
    }

    public void setFullName(String fullName){
        this.fullName =fullName;
    }

    public Integer getUid() {
        return uid;
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
}
