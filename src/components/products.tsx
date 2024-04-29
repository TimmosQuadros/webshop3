import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../utils/api'; // Adjust the import path based on your project structure
import { CartItem } from './shoppingcart.tsx';

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: string | null;
    imagePath: string;
    giftWrap: boolean;
}

export const DisplayProducts = ( shoppingCart: {addItem: (arg0: CartItem) => void; }) => {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProducts();
                setProductsData(products);
                setLoading(false);
            } catch (error) {
                if (error instanceof Error) { // Type guard to check if it's an Error object
                    console.log(error.message);
                } else {
                    console.log('An unknown error occurred');
                }
                setLoading(false);
            }
        };
        loadProducts();
    }, []); // Empty dependency array means this effect runs only once after the initial render

    const handleAddToBasket = (productId: string) => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            shoppingCart.addItem(product);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Logic to generate product list based on the cart
    return (
        <div id="products" className="products-container">
            {productsData.map((product) => (
                <div key={product.id} className="product">
                    <div className="product-content"> {/* New wrapper */}
                        <div className="product-image">
                        <img src={`http://172.232.129.131${product.imagePath}`} alt={product.name} />
                        </div>
                        <h4 className="product-name">{product.name}</h4>
                        <div className="product-price">{product.currency}{product.price.toFixed(2)}</div>
                    </div>
                    <button onClick={() => handleAddToBasket(product.id)} className="ATB-button">
                        Add to Basket
                    </button>
                </div>
            ))}
        </div>
    );
};
