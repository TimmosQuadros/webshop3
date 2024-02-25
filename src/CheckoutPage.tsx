import React, { useState, useEffect } from 'react';
//import { useLocation } from 'react-router-dom';
import {CartItem} from "./shoppingcart.tsx";
// ... (other imports)

type GroupedCartItem = CartItem & { quantity: number, accumulatedPrice: number };
// CheckoutPage component
const CheckoutPage = ({cartItems, removeItem}) => {
    console.log(removeItem);
    //const location = useLocation();
    //const cartItems = location.state?.cartItems;
    const [isGiftWrapChecked, setIsGiftWrapChecked] = useState(false);
    const giftWrapPrice = 5; // Adjust as needed

    const groupedCartItems = cartItems.reduce((acc: GroupedCartItem[], item: CartItem) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            const updatedGroupedItem = { ...existingItem, quantity: existingItem.quantity + 1, accumulatedPrice: existingItem.accumulatedPrice + item.price };
            const filteredItems = acc.filter(i => i.id !== item.id);
            return [...filteredItems, updatedGroupedItem];
        }
        return [...acc, { ...item, quantity: 1, accumulatedPrice: item.price }];
    }, [] as GroupedCartItem[]);

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
            <div className="home-logo">
                <img src="/home-logo.png" alt="Home"/>
            </div>
            <h1>Checkout</h1>
            <ul className="cart-items-list">
                {groupedCartItems.length === 0 && <li>Your cart is empty.</li>}
                {groupedCartItems.map((item) => (
                    <li key={item.id} className="cart-item">
                        <span className="product-name">{item.name}</span>
                        <span className="product-price">{item.currency}{item.price.toFixed(2)}</span>
                        <span className="product-quantity">{item.quantity} pc.</span>
                        <button className="delete-item" onClick={() => removeItem(item.id)}>X</button>
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
