import React, { useState, useEffect } from 'react';
import {shoppingCart} from "./shopping_cart.ts";
// ... (other imports)

// Define CartItem type and ShoppingCart class as before
type CartItem = {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
};

// CheckoutPage component
const CheckoutPage = () => {
    const [isGiftWrapChecked, setIsGiftWrapChecked] = useState(false);
    const giftWrapPrice = 5; // Adjust as needed

    const handleGiftWrapChange = () => setIsGiftWrapChecked(!isGiftWrapChecked);

    const calculateTotalPrice = () => {
        const basePrice = shoppingCart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        return isGiftWrapChecked ? basePrice + giftWrapPrice : basePrice;
    };

    useEffect(() => {
        // Update total price on cart change
        calculateTotalPrice();
    }, [shoppingCart.items, isGiftWrapCheckedisGiftWrapChecked]);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <ul className="cart-items-list">
                {shoppingCart.items.length === 0 && <li>Your cart is empty.</li>}
                {shoppingCart.items.map((item) => (
                    <li key={item.id} className="cart-item">
                        <span className="product-name">{item.name}</span>
                        <span className="product-price">{item.currency}{item.price.toFixed(2)}</span>
                        <span className="product-quantity">x{item.quantity}</span>
                        <button className="delete-item" onClick={() => shoppingCart.removeItem(item.id)}>X</button>
                    </li>
                ))}
            </ul>
            <div className="gift-wrap-option">
                <label htmlFor="gift-wrap">
                    <input
                        type="checkbox"
                        id="gift-wrap"
                        checked={isGiftWrapChecked}
                        onChange={handleGiftWrapChange}
                    />
                    Gift wrap (+{giftWrapPrice}{item.currency})
                </label>
            </div>
            <div className="total-price">
                Total: {item.currency}{calculateTotalPrice().toFixed(2)}
            </div>
            <button className="checkout-button">Proceed to Checkout</button>
        </div>
    );
};

export default CheckoutPage;
