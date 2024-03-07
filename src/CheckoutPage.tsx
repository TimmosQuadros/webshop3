import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import {CartItem} from "./shoppingcart.tsx";
import { validateEmail, validatePhoneNumber, fetchCityNameFromZip, validateVATNumber } from './utils/utils.tsx';


type GroupedCartItem = CartItem & { quantity: number, accumulatedPrice: number };
// CheckoutPage component

interface CheckoutPageProps {
    cartItems: CartItem[];
    removeItem: (itemId: string) => void;
    setCartItems: (items: CartItem[]) => void;
}


// ... (other imports)
const CheckoutPage: React.FC<CheckoutPageProps> = ({cartItems, removeItem, setCartItems}) => {
    const giftWrapPrice = 5; // Adjust as needed
    // Add state for the form fields
    const [country, setCountry] = useState('Denmark'); // Limited to Denmark for now
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyVATNumber, setCompanyVATNumber] = useState('');

    const groupedCartItems = cartItems.reduce((acc: GroupedCartItem[], item: CartItem) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            const updatedGroupedItem = { ...existingItem, quantity: existingItem.quantity + 1, accumulatedPrice: existingItem.accumulatedPrice + item.price };
            const filteredItems = acc.filter(i => i.id !== item.id);
            return [...filteredItems, updatedGroupedItem];
        }
        return [...acc, { ...item, quantity: 1, accumulatedPrice: item.price }];
    }, [] as GroupedCartItem[]);

    //const handleGiftWrapChange = () => setIsGiftWrapChecked(!isGiftWrapChecked);

    const calculateTotalPrice = () => {
        const basePrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const giftWrapTotal = cartItems.reduce((total, item) => total + (item.giftWrap ? giftWrapPrice * item.quantity : 0), 0);
        return basePrice + giftWrapTotal;
    };

    // Add or update a function to toggle gift wrap for an individual item
    const toggleGiftWrap = (itemId: string) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                return { ...item, giftWrap: !item.giftWrap };
            }
            return item;
        });
        // Update the cart items with the new state
        // setCartItems should be a function passed from the parent that updates the cartItems state
        setCartItems(updatedCartItems);
    };

    useEffect(() => {
        // Update total price on cart change
        calculateTotalPrice();
        if (country === 'Denmark' && zipCode) {
            fetchCityNameFromZip(zipCode).then(setCity).catch(console.error);
        }
    }, [cartItems, zipCode, country]);

    // Address form JSX
    const addressForm = (
        <form className="address-form">
            <h2>Delivery Address</h2>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="text" placeholder="Phone (8 digits if Denmark)" value={phone} onChange={e => setPhone(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" placeholder="Address Line 1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} />
            <input type="text" placeholder="Address Line 2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
            <input type="text" placeholder="Zip Code" value={zipCode} onChange={e => setZipCode(e.target.value)} />
            <input type="text" placeholder="City" value={city} disabled />
            <input type="text" placeholder="Country" value={country} disabled />
            <input type="text" placeholder="Company Name (Optional)" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            <input type="text" placeholder="Company VAT Number (8 digits if Denmark)" value={companyVATNumber} onChange={e => setCompanyVATNumber(e.target.value)} />
            {/* Add more form fields as needed */}
        </form>
    );

    return (
        <div className="checkout-page">
            <div className="header">
                <div className="home-logo">
                    <img src="/home-logo.png" alt="Home"/>
                </div>
            </div>
            <h1 className="checkout-title">Checkout</h1>
            <div className="content">
                <div className="delivery-address-column">
                    {addressForm}
                </div>
                <div className="cart-items-column">
                    <ul className="cart-items-list">
                        {groupedCartItems.length === 0 && <li>Your cart is empty.</li>}
                        {groupedCartItems.map((item) => (
                            <li key={item.id} className="cart-item">
                                <span className="product-name">{item.name}</span>
                                <span className="product-price">{item.currency}{item.price.toFixed(2)}</span>
                                <span className="product-quantity">{item.quantity} pc.</span>
                                <label htmlFor={`gift-wrap-${item.id}`}>
                                    <input
                                        type="checkbox"
                                        id={`gift-wrap-${item.id}`}
                                        checked={item.giftWrap}
                                        onChange={() => toggleGiftWrap(item.id)}
                                    />
                                    Gift wrap (+{giftWrapPrice}{item.currency})
                                </label>
                                <button className="delete-item" onClick={() => removeItem(item.id)}>X</button>
                            </li>
                        ))}
                    </ul>
                    <div className="total-price">
                        Total: {cartItems.length > 0 ? cartItems[0].currency : 'USD'}{calculateTotalPrice().toFixed(2)}
                    </div>
                    <button className="checkout-button">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
