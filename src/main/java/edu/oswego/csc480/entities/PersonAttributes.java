package edu.oswego.csc480.entities;

import jakarta.persistence.*;

@Entity
@Table(name="person_attributes")
public class PersonAttributes {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="person_attribute_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name="person_id")
    private Person person;

    @Column(name="shirt_size")
    private String shirtSize;

    @Column(name="favorite_color")
    private String favoriteColor;

    @Column(name="shoe_size")
    private int shoeSize;

    public PersonAttributes(){}

    public Integer getId() {
        return id;
    }

    public String getShirtSize() {
        return shirtSize;
    }

    public String getFavoriteColor() {
        return favoriteColor;
    }

    public int getShoeSize() {
        return shoeSize;
    }

    public Person getPerson() {
        return person;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setShoeSize(int shoeSize) {
        this.shoeSize = shoeSize;
    }

    public void setShirtSize(String shirtSize) {
        this.shirtSize = shirtSize;
    }

    public void setFavoriteColor(String favoriteColor) {
        this.favoriteColor = favoriteColor;
    }

    public void setPerson(Person person) {
        this.person = person;
    }
}
