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

    public Gift(){

    }

    //TODO: add setters and getters





}
