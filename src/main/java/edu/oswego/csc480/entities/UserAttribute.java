package edu.oswego.csc480.entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="user_attributes")
public class UserAttribute implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_attribute_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonbTransient
    private User user;

    @Column(name = "favorite_color")
    private String favoriteColor;

    @Column(name = "shirt_size")
    private String shirtSize;

    @Column(name = "pant_size")
    private String pantSize;

    @Column(name = "shoe_size")
    private String shoeSize;

    @Column(name = "jacket_size")
    private String jacketSize;

    @Column(name = "dress_size")
    private String dressSize;

    @Column(name = "preferred_fit")
    private String preferredFit;

    @Column(name = "style_description")
    private String styleDescription;

    @Column(name = "favorite_brands")
    private String favoriteBrands;

    @Column(name = "favorite_foods")
    private String favoriteFoods;

    @Column(name = "favorite_drinks")
    private String favoriteDrinks;

    @Column(name = "ring_size")
    private String ringSize;

    @Column(name = "metal_preference")
    private String metalPreference;

    @Column(name = "likes")
    private String likes;

    @Column(name = "dislikes")
    private String dislikes;

    @Column(name = "interests")
    private String interests;

    public UserAttribute() {}

    //get
    public Integer getId() { return id; }

    public User getUser() { return user; }

    public String getFavoriteColor() { return favoriteColor; }

    public String getShirtSize() { return shirtSize; }

    public String getPantSize() { return pantSize; }

    public String getShoeSize() { return shoeSize; }

    public String getJacketSize() { return jacketSize; }

    public String getDressSize() { return dressSize; }

    public String getPreferredFit() { return preferredFit; }

    public String getStyleDescription() { return styleDescription; }

    public String getFavoriteBrands() { return favoriteBrands; }

    public String getFavoriteFoods() { return favoriteFoods; }

    public String getFavoriteDrinks() { return favoriteDrinks; }

    public String getRingSize() { return ringSize; }

    public String getMetalPreference() { return metalPreference; }

    public String getLikes() { return likes; }

    public String getDislikes() { return dislikes; }

    public String getInterests() { return interests; }

    //set
    public void setId(Integer id) { this.id = id; }

    public void setUser(User user) { this.user = user; }

    public void setFavoriteColor(String favoriteColor) { this.favoriteColor = favoriteColor; }

    public void setShirtSize(String shirtSize) { this.shirtSize = shirtSize; }

    public void setPantSize(String pantSize) { this.pantSize = pantSize; }

    public void setShoeSize(String shoeSize) { this.shoeSize = shoeSize; }

    public void setJacketSize(String jacketSize) { this.jacketSize = jacketSize; }

    public void setDressSize(String dressSize) { this.dressSize = dressSize; }

    public void setPreferredFit(String preferredFit) { this.preferredFit = preferredFit; }

    public void setStyleDescription(String styleDescription) { this.styleDescription = styleDescription; }

    public void setFavoriteBrands(String favoriteBrands) { this.favoriteBrands = favoriteBrands; }

    public void setFavoriteFoods(String favoriteFoods) { this.favoriteFoods = favoriteFoods; }

    public void setFavoriteDrinks(String favoriteDrinks) { this.favoriteDrinks = favoriteDrinks; }

    public void setRingSize(String ringSize) { this.ringSize = ringSize; }

    public void setMetalPreference(String metalPreference) { this.metalPreference = metalPreference; }

    public void setLikes(String likes) { this.likes = likes; }

    public void setDislikes(String dislikes) { this.dislikes = dislikes; }

    public void setInterests(String interests) { this.interests = interests; }
}
