package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

@Entity
@Table(name="gift_status")
public class GiftStatus {

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="cycle_id")
    private Integer id;

    @Column(name="cycle_name")
    private String stage;

    @OneToOne(mappedBy = "cycle")
    @JsonbTransient
    private Gift gift;

    public GiftStatus(){}

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
