import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

// Define the CartItem type
export type CartItem = {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
    giftWrap: boolean;
    imagePath: string;
    rebateQuantity?: number;
    rebatePercent?: number;
    upsellProductId?: string;
};

type GroupedCartItem = CartItem & { quantity: number, accumulatedPrice: number };




type ShoppingCartProps = {
    cartItems: CartItem[];
    removeItem: (itemId: string) => void;
    setCartItems: (items: CartItem[]) => void;
};

// ShoppingCart functional component
const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, removeItem }) => {

    const [groupedCartItems, setGroupedCartItems] = useState<GroupedCartItem[]>([]);

    /*const groupedCartItems = cartItems.reduce((acc: GroupedCartItem[], item: CartItem) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            const updatedGroupedItem = { ...existingItem, quantity: existingItem.quantity + 1, accumulatedPrice: existingItem.accumulatedPrice + item.price };
            const filteredItems = acc.filter(i => i.id !== item.id);
            return [...filteredItems, updatedGroupedItem];
        }
        return [...acc, { ...item, quantity: 1, accumulatedPrice: item.price }];
    }, [] as GroupedCartItem[]);*/

    useEffect(() => {

    const newGroupedCartItems = cartItems.reduce((acc: GroupedCartItem[], item: CartItem) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            const updatedGroupedItem = { ...existingItem, quantity: existingItem.quantity + item.quantity, accumulatedPrice: existingItem.accumulatedPrice + item.price * item.quantity };
            const filteredItems = acc.filter(i => i.id !== item.id);
            return [...filteredItems, updatedGroupedItem];
        }
        return [...acc, { ...item, quantity: item.quantity, accumulatedPrice: item.price * item.quantity }];
    }, []);

    setGroupedCartItems(newGroupedCartItems);

}, [cartItems]);

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const navigate = useNavigate();
    // Function to navigate to CheckoutPage
    const navigateToCheckout = () => {
        navigate('/checkout', { state: { cartItems: cartItems } });
    };

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
                                {item.quantity <= 5 && (
                                    <div className="nudge">Buy more than 5 to get a 5% discount!</div>
                                )}
                                <button className="delete-item" onClick={() => {removeItem(item.id)
                                }}>X
                                </button>
                            </li>
                        ))}
                       {/* Add a check for empty `cartItems` before accessing the first element */}
                       {cartItems.length > 0 && (
                            <li className="cart-total">Total: {cartItems[0].currency}{totalCost.toFixed(2)}</li>
                        )}
                        <li className="checkout-button-li">
                            <button className="checkout-button" onClick={navigateToCheckout}>Checkout</button>
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
