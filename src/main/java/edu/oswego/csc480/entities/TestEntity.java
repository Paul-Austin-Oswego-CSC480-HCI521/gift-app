package edu.oswego.csc480.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serializable;

@Entity
@Table(name="users")
public class TestEntity implements Serializable {
	@Id private int uid;
	@Column(name="first_name") private String firstName;
	@Column(name="last_name") private String lastName;
	@Column(name="full_name") private String fullName;

	public void setUid(int id){uid =id;}
	public void setFirstName(String f){firstName = f;}
	public void setLastName(String l){lastName=l;}
	public void setFullName(String f){fullName=f;}

	public int getUid(){return uid;}
	public String getFirstName(){return firstName;}
	public String getLastName(){return lastName;}
	public String getFullName(){return fullName;}

	public TestEntity(){}
}
