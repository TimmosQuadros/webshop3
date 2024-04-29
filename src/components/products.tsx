import { useEffect, useState } from 'react';
import { fetchProducts } from '../utils/api';
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

export const DisplayProducts = ({ shoppingCart: { addItem } }: { shoppingCart: { addItem: (arg0: CartItem) => void; } }) => {
    const [productsData, setProductsData] = useState<Product[]>([]);
    // Define error state to accept both string and null
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
                    console.log(error.message); // It's a good practice to log the error
                    setError(error.message); // Set the actual error message to state
                } else {
                    console.log('An unknown error occurred');
                    setError('An unknown error occurred'); // Set a generic error message
                }
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleAddToBasket = (productId: string) => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            if (product.upsellProductId === null) {
                // Handle the scenario where upsellProductId is null if necessary
            }
            addItem({
                ...product,
                upsellProductId: product.upsellProductId || undefined // Handling null to undefined conversion
            } as CartItem);
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
                            <img src={`http://172.232.129.131${product.imagePath}`} alt={product.name} />
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
