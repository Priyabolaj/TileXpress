package com.tilexpress.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tilexpress.model.Cart;
import com.tilexpress.model.CartItems;
import com.tilexpress.model.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItems, Long>{

	@Query("SELECT ci FROM CartItems ci WHERE ci.cart =:cart AND ci.product = :product AND ci.size = :size AND ci.userId = :userId")
	public CartItems isCartItemExist(@Param("cart") Cart cart, @Param("product") Product product, @Param("size") String size,
                                     @Param("userId")Long userId);

	@Modifying
	@Query(value = "DELETE FROM cart_items WHERE cart_id = (SELECT id FROM cart WHERE user_id = ?)", nativeQuery = true)
	public void deleteCartItemsByUserId(@Param("userId") Long userId);

}
