import productsData from "./assets/products.json";

// products.ts

export const dummyProducts = [
    { id: '1', name: 'MacBook Pro 2023 M2 Pro 14.2" 12CPU/19GPU/1TB', price: 3399.99, quantity: 1, imagePath: '/product_imgs/MacBook_Pro_14.jpeg'},
    { id: '2', name: 'MacBook Pro 2022 M2 13.3" 8C GPU, 8GB, 512GB Silver', price: 1779.00, quantity: 1, imagePath: '/product_imgs/MacBook_Pro_13.jpg' },
    { id: '3', name: 'MacBook Air 2023 M2 15" 8CPU 10GPU 512GB Midnight', price: 2068.50, quantity: 1, imagePath: '/product_imgs/MacBook_Air_15.jpeg' },
    { id: '4', name: 'MacBook Air 2022 M2 13.6" 10C GPU, 8GB, 512GB Silver', price: 1909.50, quantity: 1, imagePath: '/product_imgs/MacBook_Air_13.jpeg' },
    { id: '5', name: 'iMac 2023 M3 24" 4.5K  8‑core CPU/10 GPU, 512GB Green', price: 2330.00, quantity: 1, imagePath: '/product_imgs/iMac_M3.jpeg' },
    { id: '6', name: 'iMac 2021 M1 24" 4.5K 8‑core CPU/8 GPU, 512GB Silver', price: 1678.00, quantity: 1, imagePath: '/product_imgs/iMac_24.jpeg' },
    { id: '7', name: 'iPad Pro 2022 12.9" Wi‑Fi + Cell 2TB Silver', price: 3399.99, quantity: 1, imagePath: '/product_imgs/iPad_Pro.jpeg' },
    { id: '8', name: 'iPad Pro 2022 12.9" Wi‑Fi + Cell 1TB Space Grey', price: 2820.00, quantity: 1, imagePath: '/product_imgs/iPad_Pro_1tb.jpeg' },
    { id: '9', name: 'Mac Studio 2023 M2 Ultra 24CPU 60GPU 1TB SSD', price: 5468.00, quantity: 1, imagePath: '/product_imgs/Mac_Studio_M2.jpeg' },
    { id: '10', name: 'Mac Studio 2022 M1 Max 10c CPU 24c GPU 512GB', price: 2473.60, quantity: 1, imagePath: '/product_imgs/Mac_Studio.jpeg' }
    // Add more products as needed
];

interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: string | null;
}

export function displayProducts(shoppingCart: { addItem: (arg0: { id: string; name: string; price: number; quantity: number; }) => void; }) {
    const productsContainer = document.querySelector<HTMLDivElement>('#products');

    const productsMap = new Map<string, Product>();
    productsData.forEach((product: Product) => {
        productsMap.set(product.id, product);
    });
    if (productsContainer) {
        productsContainer.innerHTML = ''; // Clear existing products if any
        productsMap.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
        <div class="product-image"><img src="ingenting" alt="${product.name}"></div>
        <h4 class="product-name">${product.name}</h4>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-basket" data-id="${product.id}">Add to Basket</button>
      `;
            productsContainer.appendChild(productElement);
        });

        productsContainer.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.className === 'add-to-basket') {
                const productId = target.getAttribute('data-id');
                const product = dummyProducts.find(p => p.id === productId);
                if (product) {
                    shoppingCart.addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                    });
                }
            }
        });
    }
}

export const DisplayProducts = (shoppingCart: { addItem: (arg0: { id: string; name: string; price: number; currency: string; rebateQuantity: number; rebatePercent: number; upsellProductId: string | null; }) => void; }) => {


    const handleAddToBasket = (productId: string) => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            shoppingCart.addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                rebateQuantity: product.rebateQuantity,
                rebatePercent: product.rebatePercent,
                upsellProductId: product.upsellProductId
            });
        }
    };
    // Logic to generate product list based on the cart
    return (
        <div id="products" className="products-container">
            {productsData.map((product) => (
                <div key={product.id} className="product">
                    <div className="product-image">
                        <img src={product.name} alt={product.name} /> {/* Replace 'product.imageUrl' with your actual image property */}
                    </div>
                    <h4 className="product-name">{product.name}</h4>
                    <div className="product-price">{product.currency}{product.price.toFixed(2)}</div>
                    <button onClick={() => handleAddToBasket(product.id)} className="add-to-basket">
                        Add to Basket
                    </button>
                </div>
            ))}
        </div>
    );
};
