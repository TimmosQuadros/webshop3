import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import {CartItem} from "../components/shoppingcart.tsx";
import { validateEmail, validatePhoneNumber, fetchCityNameFromZip, validateVATNumber } from '../utils/utils.tsx';
import { useAddressForm } from '../components/addressFormContext.tsx';

type GroupedCartItem = CartItem & { quantity: number, accumulatedPrice: number };
// CheckoutPage component

interface CheckoutPageProps {
    cartItems: CartItem[];
    removeItem: (itemId: string) => void;
    setCartItems: (items: CartItem[]) => void;
}


const CheckoutPage: React.FC<CheckoutPageProps> = ({cartItems, removeItem, setCartItems}) => {
    const giftWrapPrice = 5; // Adjust as needed

    const {
        country,
        setCountry,
        zipCode,
        setZipCode,
        city,
        setCity,
        addressLine1,
        setAddressLine1,
        addressLine2,
        setAddressLine2,
        name,
        setName,
        phone,
        setPhone,
        email,
        setEmail,
        companyName,
        setCompanyName,
        companyVATNumber,
        setCompanyVATNumber,
        // Include other state and setters as needed
      } = useAddressForm();

    // Component-specific state using useState
  const [isBillingSameAsDelivery, setIsBillingSameAsDelivery] = useState(true);
  const [billingZipCode, setBillingZipCode] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingCountry, setBillingCountry] = useState('Denmark');
  const [billingName, setBillingName] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingAddressLine1, setBillingAddressLine1] = useState('');
  const [billingAddressLine2, setBillingAddressLine2] = useState('');
  const [billingPhoneValidation, setBillingPhoneValidation] = useState(true);
  const [billingEmailValidation, setBillingEmailValidation] = useState(true);
  const [billingZipValidation, setBillingZipValidation] = useState(true);

    // Inside CheckoutPage component
    const [phoneValidation, setPhoneValidation] = useState(true); // true means valid
    const [emailValidation, setEmailValidation] = useState(true); // 
    const [vatValidation, setVatValidation] = useState(true); // 
    const [zipValidation, setZipValidation] = useState(true); //

    // Form errors
    const [formErrors, setFormErrors] = useState<string[]>([]);

    // GroupedCartItems
    const [groupedCartItems, setGroupedCartItems] = useState<GroupedCartItem[]>([]);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('');
    const [giftCardDetails, setGiftCardDetails] = useState({
        amount: '',
        number: '',
    });
    const [mobilePayNumber, setMobilePayNumber] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptMarketing, setAcceptMarketing] = useState(false);
    const [orderComment, setOrderComment] = useState('');

    const handleGiftCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGiftCardDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Submit form
    const [buttonText, setButtonText] = useState('Proceed to Checkout');
    const [isFormReadyForSubmit, setIsFormReadyForSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const handleCheckoutButtonClick = () => {
        // First click: Check for form errors and terms acceptance
        if (buttonText === 'Proceed to Checkout') {
            if (formErrors.length === 0) {
                setButtonText('Place Order');
                setIsFormReadyForSubmit(true); // Allow the form to be submitted on the next click
            } else {
                alert('Please correct the form errors before proceeding.');
            }
        }
        // Second click: Submit the form
        else if (buttonText === 'Place Order' && isFormReadyForSubmit) {
            setIsLoading(true); // Set loading state to true during submission
            // Here we should gather the form data and submit it
            submitFormData();
        }
    };
/*
    const handleMobilePayNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMobilePayNumber(value);
        const isValid = !value || (value.length === 8 && !isNaN(Number(value))); // Validate as 8 digits
        setMobilePayNumberValidation(isValid);
        updateFormErrors("Invalid MobilePay number", !isValid);
    };
*/
    const submitFormData = () => {
        // Prepare cart items data
        const cartItemsData = groupedCartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            giftWrap: item.giftWrap,
        }));

        // Determine payment method details
        let paymentDetails = {};
        if (paymentMethod === 'mobilePay') {
            paymentDetails = {
                mobilePayNumber,
            };
        } else if (paymentMethod === 'giftCard') {
            paymentDetails = {
                giftCardNumber: giftCardDetails.number,
                giftCardAmount: giftCardDetails.amount,
            };
        }

        // Create the formData object
        const formData = {
            name,
            phone,
            email,
            addressLine1,
            addressLine2,
            city,
            zipCode,
            country,
            companyName,
            companyVATNumber,
            cartItems: cartItemsData,
            totalPrice: calculateTotalPrice().toFixed(2),
            paymentMethod,
            paymentDetails,
            acceptTerms,
            acceptMarketing,
            orderComment,
        };

        // Perform the submission
        fetch('https://eokey0hl88641a2.m.pipedream.net', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Order placed successfully!');
                // Here, we might want to reset the form or redirect the user
                setButtonText('Proceed to Checkout');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while submitting your order.');
            });
    };

    /*const groupedCartItems = cartItems.reduce((acc: GroupedCartItem[], item: CartItem) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            const updatedGroupedItem = { ...existingItem, quantity: existingItem.quantity + 1, accumulatedPrice: existingItem.accumulatedPrice + item.price };
            const filteredItems = acc.filter(i => i.id !== item.id);
            return [...filteredItems, updatedGroupedItem];
        }
        return [...acc, { ...item, quantity: 1, accumulatedPrice: item.price }];
    }, [] as GroupedCartItem[]);*/

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
        // Treat the field as valid if it's empty or if it passes validation
        const isValid = !value || validatePhoneNumber(value);
        setPhoneValidation(isValid);
        updateFormErrors("Invalid phone number", !isValid);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        // Treat the field as valid if it's empty or if it passes validation
        const isValid = !value || validateEmail(value);
        setEmailValidation(isValid);
        updateFormErrors("Invalid email", !isValid);
    };

    const handleVATChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCompanyVATNumber(value);
        // Treat the field as valid if it's empty or if it passes validation
        const isValid = !value || validateVATNumber(value);
        setVatValidation(isValid);
        updateFormErrors("Invalid VAT number", !isValid);
    };

    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setZipCode(value); // Assuming you have setZipCode from useState for zipCode

        if (!value) {
            setZipValidation(true); // Assume empty zip code is valid
            setCity(''); // Clear city name
            // Optionally clear related errors
            updateFormErrors("Invalid zip code", false);
        } else {
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
        }
    };
    const handleBillingPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillingPhone(value);
        // Treat the field as valid if it's empty or if it passes validation
        const isValid = !value || validatePhoneNumber(value);
        setBillingPhoneValidation(isValid);
        updateFormErrors("Invalid billing phone number", !isValid);
    };
    const handleBillingEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillingEmail(value);
        // Treat the field as valid if it's empty or if it passes validation
        const isValid = !value || validateEmail(value);
        setBillingEmailValidation(isValid);
        updateFormErrors("Invalid billing email", !isValid);
    };

    // Handler for billing zip code change (similarly for other fields as needed)
    const handleBillingZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillingZipCode(value); // Assuming you have setZipCode from useState for zipCode
        if (!value) {
            setBillingZipValidation(true); // Assume empty zip code is valid
            setBillingCity(''); // Clear city name
            updateFormErrors("Invalid zip code", false);
        } else {
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
        }
    };
    const updateFormErrors = (errorMessage: string, hasError: boolean) => {
        setFormErrors((currentErrors) => {
            const errorSet = new Set(currentErrors);
            if (hasError) {
                errorSet.add(errorMessage);
            } else {
                errorSet.delete(errorMessage);
            }
            return [...errorSet];
        });
    };




    useEffect(() => {
        // Update total price on cart change
        calculateTotalPrice();
        //TODO Remove next line when setCountry feature is implemented!!!
        setCountry('Denmark');

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
                style={{borderColor: phoneValidation ? '#00ff00' : 'red'}}
            />
            <input
                data-testid="emailInput"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                style={{borderColor: emailValidation ? '#00ff00' : 'red'}}
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
                style={{borderColor: zipValidation ? '#00ff00' : 'red'}}
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
                style={{borderColor: vatValidation ? '#00ff00' : 'red'}}
            />
            {/* Add more form fields as needed */}

            {!isBillingSameAsDelivery && (
                <div className="billing-address-form">
                    <h2>Billing Address</h2>
                    <input type="text" placeholder="Billing Name" value={billingName} onChange={e => setBillingName(e.target.value)} />
                    <input type="text" placeholder="Billing Phone" value={billingPhone} onChange={handleBillingPhoneChange} style={{borderColor: billingPhoneValidation ? '#00ff00' : 'red'}} />
                    <input type="email" placeholder="Billing Email" value={billingEmail} onChange={handleBillingEmailChange} style={{borderColor: billingEmailValidation ? '#00ff00' : 'red'}} />
                    <input type="text" placeholder="Billing Address Line 1" value={billingAddressLine1} onChange={e => setBillingAddressLine1(e.target.value)} />
                    <input type="text" placeholder="Billing Address Line 2" value={billingAddressLine2} onChange={e => setBillingAddressLine2(e.target.value)} />
                    <input type="text" placeholder="Billing Zip Code" value={billingZipCode} onChange={handleBillingZipChange} style={{borderColor: billingZipValidation ? '#00ff00' : 'red'}} />
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

    function setItemQuantity(itemId: string, newQuantity: number) {
        // Ensure the new quantity is at least 1
        const updatedQuantity = Math.max(newQuantity, 1);

        // Map through the existing cartItems to find and update the quantity of the specific item
        const updatedCartItems = groupedCartItems.map(item => {
            if (item.id === itemId) {
                // If the item ID matches, update the quantity
                return { ...item, quantity: updatedQuantity };
            }

            // For items that don't match, return them unchanged
            return item;
        });

        // Update the cart items with the new state
        setCartItems(updatedCartItems);
        
    }

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
                                <div key={index} style={{color: 'red'}}>{error}</div>
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

                                <div className="product-quantity-controls">
                                    <input
                                        className="quantity-input"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => setItemQuantity(item.id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>

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

                    <div className="payment-section">
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="">Select Payment Method</option>
                            <option value="mobilePay">MobilePay</option>
                            <option value="giftCard">Gift Card</option>
                            {/* Conditionally render the Invoice option based on companyVATNumber being filled */}
                            {companyVATNumber && <option value="invoice">Invoice</option>}
                        </select>
                        {paymentMethod === 'giftCard' && (
                            <div>
                                <input
                                    type="text"
                                    name="amount"
                                    value={giftCardDetails.amount}
                                    onChange={handleGiftCardDetailsChange}
                                    placeholder="Gift Card Amount"
                                />
                                <input
                                    type="text"
                                    name="number"
                                    value={giftCardDetails.number}
                                    onChange={handleGiftCardDetailsChange}
                                    placeholder="Gift Card Number"
                                />
                            </div>
                        )}
                        {paymentMethod === 'mobilePay' && (
                            <input
                                type="text"
                                value={mobilePayNumber}
                                onChange={(e) => setMobilePayNumber(e.target.value)}
                                placeholder="MobilePay Number"
                            />
                        )}
                        <div className="checkbox-container">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    style={{display: 'none'}} // Hide the original checkbox
                                />
                                <span className="checkbox-custom"></span> Accept Terms & Conditions
                            </label>
                        </div>
                        <div className="checkbox-container">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={acceptMarketing}
                                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                                    style={{display: 'none'}} // Hide the original checkbox
                                />
                                <span className="checkbox-custom"></span> Accept Marketing Emails
                            </label>
                        </div>
                        <textarea
                            value={orderComment}
                            onChange={(e) => setOrderComment(e.target.value)}
                            placeholder="Order Comment"
                        />
                        {/* Implement the "Proceed to Checkout" button and its logic here */}

                        // Display the nudge message if total price is less than 3000
                    </div>

                    <button className="checkout-button" onClick={handleCheckoutButtonClick} disabled={!acceptTerms}>
                        {buttonText}
                    </button>


                </div>
                {/* Display the nudge message if total price is less than 3000*/}
                {(calculateTotalPrice() <= 3000 && calculateTotalQuantity() > 0) && (
                    <div className="increase-quantity-nudge">
                        Increase quantity of items to get a discount!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
