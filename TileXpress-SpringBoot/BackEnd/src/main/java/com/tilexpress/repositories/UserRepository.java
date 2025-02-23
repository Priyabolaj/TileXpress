package com.tilexpress.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tilexpress.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
     User findByEmail(String email);

     @Query("SELECT u FROM User u WHERE u.id = :id")
     User findUserById(@Param("id") Long id);


}
