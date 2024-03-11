import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import {CartItem} from "../components/shoppingcart.tsx";
import { validateEmail, validatePhoneNumber, fetchCityNameFromZip, validateVATNumber } from '../utils/utils.tsx';


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
    // To Add state for the form fields
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

    // Inside CheckoutPage component
    const [phoneValidation, setPhoneValidation] = useState(true); // true means valid
    const [emailValidation, setEmailValidation] = useState(true); // true means valid
    const [vatValidation, setVatValidation] = useState(true); // true means valid
    const [zipValidation, setZipValidation] = useState(true); // Assume true means valid initially

    // Billing address
    const [isBillingSameAsDelivery, setIsBillingSameAsDelivery] = useState(true);
    const [billingZipCode, setBillingZipCode] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingCountry, setBillingCountry] = useState('Denmark'); // Assuming default as Denmark
    const [billingName, setBillingName] = useState('');
    const [billingPhone, setBillingPhone] = useState('');
    const [billingEmail, setBillingEmail] = useState('');
    const [billingAddressLine1, setBillingAddressLine1] = useState('');
    const [billingAddressLine2, setBillingAddressLine2] = useState('');
    const [billingPhoneValidation, setBillingPhoneValidation] = useState(true);
    const [billingEmailValidation, setBillingEmailValidation] = useState(true);
    const [billingZipValidation, setBillingZipValidation] = useState(true);

    // Form errors
    const [formErrors, setFormErrors] = useState<string[]>([]);


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
        let totalPrice = basePrice + giftWrapTotal;
    
        // Apply a 10% discount for orders over $300
        if (totalPrice > 3000) {
            totalPrice *= 0.9; // Deduct 10%
        }
    
        return totalPrice;
    };

    // Calculate total quantity of items in the cart (including quantity of each item)
    const calculateTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        const isValid = validatePhoneNumber(value);
        setPhoneValidation(isValid); // Update phone validation state

        // Update formErrors based on validation
        const newErrors = formErrors.filter(error => error !== "Invalid phone number"); // Remove the phone error if it exists
        if (!isValid && !formErrors.includes("Invalid phone number")) {
            newErrors.push("Invalid phone number");
        }
        setFormErrors(newErrors);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value); // Assuming you have setEmail from useState for email
        const isValid = validateEmail(value);
        setEmailValidation(isValid); // Update email validation state

        // Update formErrors based on validation
        const newErrors = formErrors.filter(error => error !== "Invalid email"); // Remove the email error if it exists
        if (!isValid && !formErrors.includes("Invalid email")) {
            newErrors.push("Invalid email");
        }
        setFormErrors(newErrors);
    };

    const handleVATChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCompanyVATNumber(value); // Assuming you have a setter for companyVATNumber
        const isValid = validateVATNumber(value);
        setVatValidation(isValid); // Update VAT validation state

        // Update formErrors based on validation
        const newErrors = formErrors.filter(error => error !== "Invalid VAT number"); // Remove the VAT error if it exists
        if (!isValid && !formErrors.includes("Invalid VAT number")) {
            newErrors.push("Invalid VAT number");
        }
        setFormErrors(newErrors);
    };

    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setZipCode(value); // Assuming you have setZipCode from useState for zipCode

        fetchCityNameFromZip(value)
            .then(cityNames => {
                if (cityNames.length === 1 && value.length === 4) {
                    setCity(cityNames[0]); // Assuming you're showing the city name somewhere
                    setZipValidation(true);
                    setFormErrors(prevErrors => prevErrors.filter(error => error !== "Invalid zip code"));
                } else {
                    // Either no city found or multiple possible cities, which is treated as invalid
                    setZipValidation(false);
                    if (!formErrors.includes("Invalid zip code")) {
                        setFormErrors(prevErrors => [...prevErrors, "Invalid zip code"]);
                    }
                }
            })
            .catch(() => {
                setZipValidation(false);
                if (!formErrors.includes("Invalid zip code")) {
                    setFormErrors(prevErrors => [...prevErrors, "Invalid zip code"]);
                }
            });
    };
    const handleBillingPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillingPhone(value);
        const isValid = validatePhoneNumber(value);
        setBillingPhoneValidation(isValid); // Update phone validation state

        // Update formErrors based on validation
        const newErrors = formErrors.filter(error => error !== "Invalid phone number"); // Remove the phone error if it exists
        if (!isValid && !formErrors.includes("Invalid phone number")) {
            newErrors.push("Invalid phone number");
        }
        setFormErrors(newErrors);
    };
    const handleBillingEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillingEmail(value); // Assuming you have setEmail from useState for email
        const isValid = validateEmail(value);
        setBillingEmailValidation(isValid); // Update email validation state

        // Update formErrors based on validation
        const newErrors = formErrors.filter(error => error !== "Invalid email"); // Remove the email error if it exists
        if (!isValid && !formErrors.includes("Invalid email")) {
            newErrors.push("Invalid email");
        }
        setFormErrors(newErrors);
    };

    // Handler for billing zip code change (similarly for other fields as needed)
    const handleBillingZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillingZipCode(value); // Assuming you have setZipCode from useState for zipCode

        fetchCityNameFromZip(value)
            .then(cityNames => {
                if (cityNames.length === 1 && value.length === 4) {
                    setBillingCity(cityNames[0]); // Assuming you're showing the city name somewhere
                    setBillingZipValidation(true);
                    setFormErrors(prevErrors => prevErrors.filter(error => error !== "Invalid zip code"));
                } else {
                    // Either no city found or multiple possible cities, which is treated as invalid
                    setBillingZipValidation(false);
                    if (!formErrors.includes("Invalid zip code")) {
                        setFormErrors(prevErrors => [...prevErrors, "Invalid zip code"]);
                    }
                }
            })
            .catch(() => {
                setBillingZipValidation(false);
                if (!formErrors.includes("Invalid zip code")) {
                    setFormErrors(prevErrors => [...prevErrors, "Invalid zip code"]);
                }
            });
    };



    useEffect(() => {
        // Update total price on cart change
        calculateTotalPrice();
        //TODO Remove next line when setCountry feature is implemented!!!
        setCountry('Denmark');
    }, [cartItems, zipCode, country]);

    // Address form JSX
    const addressForm = (
        <form className="address-form">
            <h2>Delivery Address</h2>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
            <input
                type="text"
                placeholder="Phone (8 digits if Denmark)"
                value={phone}
                onChange={handlePhoneChange}
                style={{borderColor: phoneValidation ? 'green' : 'red'}}
            />
            <input
                data-testid="emailInput"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                style={{borderColor: emailValidation ? 'green' : 'red'}}
            />
            <input type="text" placeholder="Address Line 1" value={addressLine1}
                   onChange={e => setAddressLine1(e.target.value)}/>
            <input type="text" placeholder="Address Line 2" value={addressLine2}
                   onChange={e => setAddressLine2(e.target.value)}/>
            <input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={handleZipChange}
                style={{borderColor: zipValidation ? 'green' : 'red'}}
            />
            <input type="text" placeholder="City" value={city} disabled/>
            <input type="text" placeholder="Country" value={country} disabled/>
            <input type="text" placeholder="Company Name (Optional)" value={companyName}
                   onChange={e => setCompanyName(e.target.value)}/>
            <input
                type="text"
                placeholder="Company VAT Number (8 digits if Denmark)"
                value={companyVATNumber}
                onChange={handleVATChange}
                style={{borderColor: vatValidation ? 'green' : 'red'}}
            />
            {/* Add more form fields as needed */}

            {!isBillingSameAsDelivery && (
                <div className="billing-address-form">
                    <h2>Billing Address</h2>
                    <input type="text" placeholder="Billing Name" value={billingName} onChange={e => setBillingName(e.target.value)} />
                    <input type="text" placeholder="Billing Phone" value={billingPhone} onChange={handleBillingPhoneChange} style={{borderColor: billingPhoneValidation ? 'green' : 'red'}} />
                    <input type="email" placeholder="Billing Email" value={billingEmail} onChange={handleBillingEmailChange} style={{borderColor: billingEmailValidation ? 'green' : 'red'}} />
                    <input type="text" placeholder="Billing Address Line 1" value={billingAddressLine1} onChange={e => setBillingAddressLine1(e.target.value)} />
                    <input type="text" placeholder="Billing Address Line 2" value={billingAddressLine2} onChange={e => setBillingAddressLine2(e.target.value)} />
                    <input type="text" placeholder="Billing Zip Code" value={billingZipCode} onChange={handleBillingZipChange} style={{borderColor: billingZipValidation ? 'green' : 'red'}} />
                    <input type="text" placeholder="Billing City" value={billingCity} onChange={e => setBillingCity(e.target.value)} disabled/>
                    <input type="text" placeholder="Billing Country" value={billingCountry} onChange={e => setBillingCountry(e.target.value)} disabled/>
                    {/* Add more fields as necessary */}
                </div>
            )}

            <input type="checkbox"
                   checked={isBillingSameAsDelivery}
                   onChange={e => setIsBillingSameAsDelivery(e.target.checked)}
            />
            <label htmlFor="billingSameAsDelivery">Billing address same as delivery address ?</label>
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
                    {formErrors.length > 0 && (
                        <div className="form-errors">
                            {formErrors.map((error, index) => (
                                <div key={index} style={{ color: 'red' }}>{error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="cart-items-column">
                    <h2>Price summary</h2>
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
                {/* Display the nudge message if total quantity is greater than or equal to 2 */}
            {calculateTotalQuantity() >= 2 && (
              <div className="increase-quantity-nudge">
                Increase quantity of items to get a discount!
              </div>
            )}
            </div>
        </div>
    );
};

export default CheckoutPage;
