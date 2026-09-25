package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="user_attributes")
public class UserAttributes implements Serializable {

    @Id
    @Column(name="user_attribute_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name="user_id")
    @JsonbTransient
    private User user;

    @Column(name="shirt_size")
    private String shirtSize;

    @Column(name="shoe_size")
    private int shoeSize;

    @Column(name="favorite_color")
    private String favoriteColor;

    public UserAttributes(){}

    public void setFavoriteColor(String favoriteColor) {
        this.favoriteColor = favoriteColor;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setShirtSize(String shirtSize) {
        this.shirtSize = shirtSize;
    }

    public void setShoeSize(int shoeSize) {
        this.shoeSize = shoeSize;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getShoeSize() {
        return shoeSize;
    }

    public Integer getId() {
        return id;
    }

    public String getFavoriteColor() {
        return favoriteColor;
    }

    public String getShirtSize() {
        return shirtSize;
    }

    public User getUser() {
        return user;
    }
}
