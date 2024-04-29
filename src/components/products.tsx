import { useEffect, useState } from 'react';
import { fetchProducts } from '../utils/api';
import { CartItem } from './shoppingcart.tsx';
import React from 'react';

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

interface Props {
    shoppingCart: {
        addItem: (item: CartItem) => void;
    };
}

export const DisplayProducts: React.FC<Props> = ({ shoppingCart }) => {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProducts();
                setProductsData(products);
                setLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    setError(error.message);
                } else {
                    console.log('An unknown error occurred');
                    setError('An unknown error occurred');
                }
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleAddToBasket = (productId: string) => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            shoppingCart.addItem({
                ...product,
                quantity: 1, // Set the added quantity to 1 regardless of the stock quantity
                upsellProductId: product.upsellProductId || undefined
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div id="products" className="products-container">
            {productsData.map((product) => (
                <div key={product.id} className="product">
                    <div className="product-content">
                        <div className="product-image">
                            <img src={`https://webapp7.crabdance.com${product.imagePath}`} alt={product.name} />
                        </div>
                        <h4 className="product-name">{product.name}</h4>
                        <div className="product-price">{product.currency}{product.price.toFixed(2)}</div>
                        <button onClick={() => handleAddToBasket(product.id)} className="ATB-button">
                            Add to Basket
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
