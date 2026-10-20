package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="user_attributes")
public class UsersAttributes implements Serializable {

    @Id
    @Column(name="user_attribute_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonbTransient
    private Users user;

    @Column(name="attribute_name")
    private String attribute_name;

    @Column(name="value")
    private String value;

    public UsersAttributes(){}

    //get
    public Integer getId() {
        return id;
    }
    public String getAttribute_Name() {
        return attribute_name;
    }
    public String getValue() {
        return value;
    }
    public Users getUser() {
        return user;
    }

    //set
    public void setId(Integer id) {
        this.id = id;
    }
    public void setAttribute_Name(String attribute_name) {
        this.attribute_name = attribute_name;
    }
    public void setValue(String value) {
        this.value = value;
    }
    public void setUser(Users user) {
        this.user = user;
    }
}
