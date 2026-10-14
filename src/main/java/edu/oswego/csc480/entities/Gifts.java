package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "gifts")
public class Gifts {

    @Id  @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="gift_id")
    private Integer id;

    @OneToOne(cascade=CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name="occasion_id")
    private Occasions occasion;

    @Column(name="purchase_date")
    private LocalDate purchaseDate;

    @Column(name="gift_name")
    private String name;

    @Column(name="gift_type")
    private String type;

    @OneToOne(cascade=CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name="cycle_id")
    private GiftStatus status;

    @ManyToOne
    @JoinColumn(name="person_id")
    @JsonbTransient
    private People person;

    @Column(name="gift_price")
    private double price;
    public Gifts(){}

    //get
    public Integer getId() {
        return id;
    }
    public People getPerson() {
        return person;
    }
    public String getName() {
        return name;
    }
    public Occasions getOccasion() {
        return occasion;
    }
    public String getType() {
        return type;
    }
    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }
    public GiftStatus getStatus() {
        return status;
    }

    //set
    public void setName(String name) {
        this.name = name;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public void setPerson(People person) {
        this.person = person;
    }
    public void setOccasion(Occasions occasion) {
        this.occasion = occasion;
    }
    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    public void setType(String type) {
        this.type = type;
    }
    public void setStatus(GiftStatus status) {
        this.status = status;
    }

}
