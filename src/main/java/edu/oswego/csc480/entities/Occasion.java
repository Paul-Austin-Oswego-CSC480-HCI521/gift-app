package edu.oswego.csc480.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="occasion")
public class Occasion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "occasion_id")
    private Integer id;

    @Column(name = "occasion_name")
    private String name;

    @Column(name = "occasion_date")
    private LocalDate date;

    public Occasion(){}

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDate() {
        return date;
    }
}
