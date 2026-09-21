package edu.oswego.csc480.entities;

import jakarta.persistence.Entity;

@Entity
public class GiftCycle {
    private Integer id;
    private String stage;
    private Gift gift;
}
