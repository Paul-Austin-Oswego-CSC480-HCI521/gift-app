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

    @OneToOne(mappedBy = "status")
    @JsonbTransient
    private Gifts gift;

    public GiftStatus(){}

    public void setId(Integer id) {
        this.id = id;
    }

    public void setGift(Gifts gift) {
        this.gift = gift;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public Gifts getGift() {
        return gift;
    }

    public Integer getId() {
        return id;
    }

    public String getStage() {
        return stage;
    }
}
