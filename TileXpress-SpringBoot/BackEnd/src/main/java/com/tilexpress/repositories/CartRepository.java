package com.tilexpress.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tilexpress.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

	@Query("SELECT c from Cart c where c.user.id = :userId ")
	public Cart findByUserId(@Param("userId")Long userId);

	@Modifying
	@Query(value = "DELETE FROM Cart WHERE user_id = :userId", nativeQuery = true)
	public void deleteCartByUserId(@Param("userId") Long userId);

}
