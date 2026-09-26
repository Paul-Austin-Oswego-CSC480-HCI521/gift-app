package edu.oswego.csc480.integration;

import edu.oswego.csc480.entities.User;
import edu.oswego.csc480.repositories.UserRepository;
import jakarta.inject.Inject;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.jboss.arquillian.junit.Arquillian;

import java.util.List;

@RunWith(Arquillian.class)
public class PersistenceIT {

    private static final String WARNAME = System.getProperty("arquillian.war.name");

    @Deployment(testable = true)
    public static WebArchive createDeployment() {
        WebArchive archive = ShrinkWrap.create(WebArchive.class, WARNAME)
                .addPackages(true, "edu.oswego.csc480");
        return archive;
    }

    @Inject
    private UserRepository uRepo;


    @Test
    public void GetAllReturnsNonEmptyList(){
        List<User> users = uRepo.findAll().toList();
        Assert.assertFalse(users.isEmpty());
    }



}
