package edu.oswego.csc480.entities;

import jakarta.persistence.*;

@Entity
@Table(name="gift_cycle") // the database has the table defined as "gifting_cycle" but gift_cycle sounds better
public class GiftCycle {

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="cycle_id")
    private Integer id;

    @Column(name="cycle_name")
    private String stage;

    @OneToOne(mappedBy = "cycle")
    private Gift gift;

    public GiftCycle(){}

    public void setId(Integer id) {
        this.id = id;
    }

    public void setGift(Gift gift) {
        this.gift = gift;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public Gift getGift() {
        return gift;
    }

    public Integer getId() {
        return id;
    }

    public String getStage() {
        return stage;
    }
}
