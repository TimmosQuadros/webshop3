import React from 'react';

// Define the CartItem type
export type CartItem = {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
};

type GroupedCartItem = CartItem & { quantity: number, accumulatedPrice: number };




type ShoppingCartProps = {
    cartItems: CartItem[];
    removeItem: (itemId: string) => void;
    setCartItems: (items: CartItem[]) => void;
};

// ShoppingCart functional component
const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, removeItem, setCartItems }) => {

    const groupedCartItems = cartItems.reduce((acc: GroupedCartItem[], item: CartItem) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            const updatedGroupedItem = { ...existingItem, quantity: existingItem.quantity + 1, accumulatedPrice: existingItem.accumulatedPrice + item.price };
            const filteredItems = acc.filter(i => i.id !== item.id);
            return [...filteredItems, updatedGroupedItem];
        }
        return [...acc, { ...item, quantity: 1, accumulatedPrice: item.price }];
    }, [] as GroupedCartItem[]);

    console.log(cartItems);
    console.log(groupedCartItems);

    // Function to add an item
    /*const addItem = (item: CartItem) => {
        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };*/

    // Function to remove an item completely
    const removeAllItem = (itemId: string) => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div id="shopping-cart-icon" className="shopping-cart">
            <img src="/shopping-basket-solid.svg" alt="Shopping Cart"/>
            <span id="cart-count">{totalItems}</span>
            <div id="cart-summary" className="cart-summary">
                {groupedCartItems.length > 0 ? (
                    <ul className="cart-items-list">
                        {groupedCartItems.map((item) => (
                            <li key={item.id} className="cart-item">
                                <span className="product-name">{item.name}</span>
                                <span className="product-price">{item.currency}{item.accumulatedPrice.toFixed(2)}</span>
                                <span className="product-quantity">{item.quantity} pc.</span>
                                <button className="delete-item" onClick={() => {removeItem(item.id)
                                }}>X
                                </button>
                            </li>
                        ))}
                        <li className="cart-total">Total: {cartItems[0].currency}{totalCost.toFixed(2)}</li>
                        {/* Add checkout button */}
                        <li className="checkout-button-li">
                            <button className="checkout-button" onClick={() => {/* handle checkout */
                            }}>Checkout
                            </button>
                        </li>
                    </ul>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
        </div>
    );
};

export { ShoppingCart };
