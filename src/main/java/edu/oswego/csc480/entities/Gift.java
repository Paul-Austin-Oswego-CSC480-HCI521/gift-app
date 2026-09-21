package edu.oswego.csc480.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "gift")
public class Gift {

    // TODO : finish this class and its relation to: Person && Occasion.

    @Id  @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="gift_id")
    private Integer id;


    private Person person;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="occasion_id")
    private Occasion occasion;

    @Column(name="purchase_date")
    private LocalDate purchaseDate;

    @Column(name="gift_name")
    private String name;
    //TODO: price, but i ain't touching it as database defined with MONEY type.
    @Column(name="gift_type")
    private String type;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="cycle_id")
    private GiftCycle cycle;

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

    public void setCycle(GiftCycle cycle) {
        this.cycle = cycle;
    }

    public GiftCycle getCycle() {
        return cycle;
    }
}
