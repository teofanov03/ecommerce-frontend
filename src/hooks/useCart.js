// src/hooks/useCart.js
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const useCart = () => {
    // 1. Inicijalizujemo stanje korpe iz localStorage-a (ili prazan niz)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('ecommerce_cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Could not load cart from localStorage", error);
            return [];
        }
    });

    // 2. Efekat za sinhronizaciju: Svaki put kad se cartItems promeni, upiši u localStorage
    useEffect(() => {
        localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Dodavanje proizvoda u korpu (Sa proverom zaliha)
    const addToCart = (product, quantity = 1) => {
        const productStock = product.stock; 

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id); 
            
            if (existingItem) {
                // Slučaj 1: Ažuriranje količine
                const newQuantity = existingItem.quantity + quantity;

                // 🛑 PROVERA ZALIHA ZA POSTOJEĆI PROIZVOD
                if (newQuantity > productStock) {
                    const availableToAdd = productStock - existingItem.quantity;
                    if (availableToAdd <= 0) {
                        toast.error(`Stock limit reached! You already have ${existingItem.quantity} units in your cart (Max: ${productStock}).`);
                    } else {
                        toast.error(`Cannot add ${quantity} units. You can only add ${availableToAdd} more (Max: ${productStock}).`);
                    }
                    return prevItems;
                }
                
                // Ako je provera OK, nastavi sa ažuriranjem
                toast.success(`Quantity for ${product.name} updated in cart!`, { 
                    duration: 3000, 
                    style: { backgroundColor: '#10B981', color: 'white', fontWeight: 'bold' }
                });

                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: newQuantity } : item
                );
            } else {
                // Slučaj 2: Dodavanje novog proizvoda
                
                // 🛑 PROVERA ZALIHA ZA NOVI PROIZVOD
                if (quantity > productStock) {
                    toast.error(`Cannot add ${quantity} units. Only ${productStock} available in stock.`);
                    return prevItems;
                }

                // Ako je provera OK, nastavi sa dodavanjem
                toast.success(`${product.name} added to cart!`, { 
                    duration: 3000, 
                    style: { backgroundColor: '#10B981', color: 'white', fontWeight: 'bold' }
                });
                
                return [...prevItems, { ...product, quantity, stock: productStock }]; // Dodato stock
            }
        });
    };
    
    // 4. Uklanjanje proizvoda iz korpe
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    // 5. Ažuriranje količine u korpi (sa PROVEROM ZALIHA)
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const itemToUpdate = prevItems.find(item => item._id === productId);

            if (!itemToUpdate) {
                return prevItems;
            }

            const productStock = itemToUpdate.stock;

            // 🛑 PROVERA 1: Minimalna količina (ako je 0 ili manje)
            if (newQuantity < 1) {
                toast.error(`${itemToUpdate.name} removed from cart.`);
                return prevItems.filter(item => item._id !== productId); // Ukloni proizvod
            }

            // 🛑 PROVERA 2: Maksimalna količina (provera zaliha)
            if (newQuantity > productStock) {
                
                if (itemToUpdate.quantity < productStock) {
                    toast.error(`Stock limit reached! Maximum quantity for ${itemToUpdate.name} is ${productStock}.`);
                } else {
                    toast.error(`Cannot increase quantity. You already have the maximum of ${productStock} units in your cart.`);

                    return prevItems; // Već je na maksimumu
                }
                
                // Postavljamo količinu na maksimum
                newQuantity = productStock; 
            }

            // Ažuriranje količine
            return prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: newQuantity } 
                    : item
            );
        });
    };

    // 6. Brisanje cele korpe
    const clearCart = () => {
        setCartItems([]);
        toast.success("Shopping cart cleared!");
    };
    
    // 7. Izračunavanje ukupne cene (bitna metrika za prikaz)
    const getTotalPrice = () => {
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return total.toFixed(2);
    };

    // 8. Izračunavanje ukupnog broja stavki
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    // Vraćanje svih funkcija i stanja
    return {
        cartItems,
        addToCart,
        removeFromCart,
        getTotalPrice,
        getCartCount,
        updateQuantity,
        clearCart,
    };
};

export default useCart;