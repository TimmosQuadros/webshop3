// ShoppingCart.js or context file
import React, { useState, useContext } from 'react';

// If using Context API, define the context
const CartContext = React.createContext(0);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addItem = (item) => {
        // Logic to add item to cart
        // This can be as simple as adding the item to the state array,
        // or more complex involving checking for duplicates and quantities
        setCartItems(prevItems => {
            // Add your logic here, for example:
            const itemExists = prevItems.find(prevItem => prevItem.id === item.id);
            if (itemExists) {
                return prevItems.map(prevItem =>
                    prevItem.id === item.id ? { ...prevItem, quantity: prevItem.quantity + 1 } : prevItem
                );
            } else {
                return [...prevItems, item];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem }}>
            {children}
        </CartContext.Provider>
    );
};