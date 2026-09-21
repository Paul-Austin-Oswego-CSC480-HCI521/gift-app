package edu.oswego.csc480.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "gift")
public class Gift {

    // TODO : finish this class and its relation to: Person && Occasion.

    private Integer id;

    private Person person;
    private Occasion occasion;
    //TODO : gift_cycle && relation to it
    private LocalDate purchaseDate;
    private String name;
    //TODO: price, but i ain't touching it as database defined with MONEY type.
    private String type;

    public Gift(){}

    //TODO: add setters and getters


    public Integer getId() {
        return id;
    }

    public Person getPerson() {
        return person;
    }

    public String getName() {
        return name;
    }

    public Occasion getOccasion() {
        return occasion;
    }

    public String getType() {
        return type;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public void setOccasion(Occasion occasion) {
        this.occasion = occasion;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public void setType(String type) {
        this.type = type;
    }
}
