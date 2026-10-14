package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

@Entity
@Table(name="person_attributes")
public class PeopleAttributes {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="person_attribute_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name="person_id", nullable = false)
    @JsonbTransient
    private People person;

    @Column(name="attribute_name")
    private String attribute_name;

    @Column(name="value")
    private String value;

    public PeopleAttributes(){}

    //get
    public Integer getId() {
        return id;
    }
    public String getAttribute_name() {
        return attribute_name;
    }
    public String getValue() {
        return value;
    }
    public People getPerson() {
        return person;
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
    public void setPerson(People person) {
        this.person = person;
    }
}
