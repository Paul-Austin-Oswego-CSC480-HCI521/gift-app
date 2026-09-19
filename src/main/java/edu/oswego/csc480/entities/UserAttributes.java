package edu.oswego.csc480.entities;

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
    @Column(name="user_id")
    private User user;

    @Column(name="shirt_size")
    private String shirtSize;

    @Column(name="shoe_size")
    private int shoeSize;

    @Column(name="favorite_color")
    private String favoriteColor;

    











}
