package edu.oswego.csc480.entities;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="users")
public class TestEntity implements Serializable {

	@Id
	@Column(name="user_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name="first_name")
	private String firstName;

	@Column(name="last_name")
	private String lastName;

	@Column(name="full_name", insertable = false, updatable = false)
	private String fullName;

	public void setId(int id){this.id =id;}
	public void setFirstName(String f){firstName = f;}
	public void setLastName(String l){lastName=l;}
	public void setFullName(String f){fullName=f;}

	public int getId(){return id;}
	public String getFirstName(){return firstName;}
	public String getLastName(){return lastName;}
	public String getFullName(){return fullName;}

	public TestEntity(){}
	public TestEntity(String firstName, String lastName){
		this.firstName = firstName;
		this.lastName = lastName;
	}
}
