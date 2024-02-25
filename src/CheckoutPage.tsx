import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// ... (other imports)


// CheckoutPage component
const CheckoutPage = () => {
    const location = useLocation();
    const cartItems = location.state?.cartItems;
    const [isGiftWrapChecked, setIsGiftWrapChecked] = useState(false);
    const giftWrapPrice = 5; // Adjust as needed

    const handleGiftWrapChange = () => setIsGiftWrapChecked(!isGiftWrapChecked);

    const calculateTotalPrice = () => {
        const basePrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return isGiftWrapChecked ? basePrice + giftWrapPrice : basePrice;
    };

    useEffect(() => {
        // Update total price on cart change
        calculateTotalPrice();
    }, [cartItems]);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <ul className="cart-items-list">
                {cartItems.length === 0 && <li>Your cart is empty.</li>}
                {cartItems.map((item) => (
                    <li key={item.id} className="cart-item">
                        <span className="product-name">{item.name}</span>
                        <span className="product-price">{item.currency}{item.price.toFixed(2)}</span>
                        <span className="product-quantity">x{item.quantity}</span>
                        <button className="delete-item" onClick={() => cartItems.removeItem(item.id)}>X</button>
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
                    Gift wrap (+{giftWrapPrice}{cartItems.length > 0 ? cartItems[0].currency : 'USD'})
                </label>
            </div>
            <div className="total-price">
                Total: {cartItems.length > 0 ? cartItems[0].currency : 'USD'}{calculateTotalPrice().toFixed(2)}
            </div>
            <button className="checkout-button">Proceed to Checkout</button>
        </div>
    );
};

export default CheckoutPage;
