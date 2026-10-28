package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

@Entity
@Table(name="user_wishlist")
public class UsersWishedItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_wishlist_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonbTransient
    private Users user;

    @Column(name="gift_name")
    private String giftName;

    @Column(name="value")
    private String value;

    public UsersWishedItem(){}

    //get
    public Integer getId() {
        return id;
    }
    public Users getUser() {
        return user;
    }
    public String getGiftName() {
        return giftName;
    }
    public String getValue() {
        return value;
    }

    //set
    public void setId(Integer id) {
        this.id = id;
    }
    public void setUser(Users user) {
        this.user = user;
    }
    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }
    public void setValue(String value) {
        this.value = value;
    }
}
