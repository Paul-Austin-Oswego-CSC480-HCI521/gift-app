package edu.oswego.csc480.entities;

import jakarta.persistence.*;

@Entity
@Table(name="user_wishlist")
public class UserWishedItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_wishlist_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @Column(name="gift_name")
    private String giftName;

    @Column(name="gift_type")
    private String giftType;

    // TODO: price, however that is iffy right now, database type for price ins MONEY which is not good.

    public UserWishedItem(){}

    public Integer getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getGiftName() {
        return giftName;
    }

    public String getGiftType() {
        return giftType;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }

    public void setGiftType(String giftType) {
        this.giftType = giftType;
    }

}
