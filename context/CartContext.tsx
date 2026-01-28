import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import COUPONS, { Coupon } from '../data/coupons';

interface CheckoutItem {
    title: string;
    quantity: number;
    price: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    total: number; // base total sin descuentos
    discount: number; // monto total descontado
    totalAfterDiscount: number; // total final
    itemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    activeCoupon: Coupon | null;
    applyCoupon: (code: string) => boolean;
    removeCoupon: () => void;
    getCheckoutItems: () => CheckoutItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('flip_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

    useEffect(() => {
        localStorage.setItem('flip_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            if (prev.some(i => i.id === item.id)) return prev; // Evitar duplicados
            return [...prev, item];
        });
        setIsCartOpen(true); // Abrir carrito al agregar
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setActiveCoupon(null);
    };

    const baseTotal = cart.reduce((acc, item) => acc + item.price, 0);

    const computeDiscountAmount = (coupon: Coupon | null) => {
        if (!coupon) return 0;
        if (coupon.targetId) {
            const targets = cart.filter(i => i.id === coupon.targetId);
            const targetSum = targets.reduce((s, it) => s + it.price, 0);
            if (coupon.type === 'percent') return (targetSum * coupon.discount) / 100;
            return Math.min(coupon.discount, targetSum);
        } else {
            if (coupon.type === 'percent') return (baseTotal * coupon.discount) / 100;
            return Math.min(coupon.discount, baseTotal);
        }
    };

    const discount = computeDiscountAmount(activeCoupon);
    const totalAfterDiscount = Math.max(0, +(baseTotal - discount).toFixed(2));

    const applyCoupon = (code: string) => {
        const found = COUPONS.find(c => c.code.toLowerCase() === code.trim().toLowerCase());
        if (!found) return false;
        setActiveCoupon(found);
        return true;
    };

    const removeCoupon = () => setActiveCoupon(null);

    const getCheckoutItems = () => {
        // Devuelve items con precios ya ajustados según el cupón (mantiene quantity = 1)
        if (!activeCoupon) return cart.map(i => ({ title: i.title, quantity: 1, price: +i.price.toFixed(2) }));

        const coupon = activeCoupon;
        const items = cart.map(i => ({ ...i }));
        const base = baseTotal || 0;

        // Funcion para redondear a 2 decimales
        const r2 = (n: number) => Math.round(n * 100) / 100;

        if (coupon.targetId) {
            // Aplica solo al targetId
            const targets = items.filter(it => it.id === coupon.targetId);
            const targetSum = targets.reduce((s, it) => s + it.price, 0);
            if (targetSum === 0) return items.map(i => ({ title: i.title, quantity: 1, price: +i.price.toFixed(2) }));

            if (coupon.type === 'percent') {
                return items.map(i => {
                    if (i.id === coupon.targetId) {
                        const p = r2(i.price * (1 - coupon.discount / 100));
                        return { title: i.title, quantity: 1, price: +p.toFixed(2) };
                    }
                    return { title: i.title, quantity: 1, price: +i.price.toFixed(2) };
                });
            } else {
                // fixed -> restar el monto fijo solo de los items objetivo proporcionalmente
                const fixed = Math.min(coupon.discount, targetSum);
                return items.map(i => {
                    if (i.id === coupon.targetId) {
                        // Si hay varios targets con mismo id (raro), proporcional
                        const share = i.price / targetSum;
                        const p = r2(i.price - fixed * share);
                        return { title: i.title, quantity: 1, price: +Math.max(0, p).toFixed(2) };
                    }
                    return { title: i.title, quantity: 1, price: +i.price.toFixed(2) };
                });
            }
        } else {
            // Cupón global
            if (base === 0) return items.map(i => ({ title: i.title, quantity: 1, price: +i.price.toFixed(2) }));

            if (coupon.type === 'percent') {
                return items.map(i => ({ title: i.title, quantity: 1, price: +r2(i.price * (1 - coupon.discount / 100)).toFixed(2) }));
            } else {
                // fixed global: distribuir proporcionalmente
                const fixed = Math.min(coupon.discount, base);
                let distributed: number[] = items.map(i => r2(i.price - (fixed * (i.price / base))));
                // Ajuste por redondeo: asegurar que la suma sea base - fixed
                const sumDistributed = distributed.reduce((s, v) => s + v, 0);
                const expected = r2(base - fixed);
                const diff = r2(expected - sumDistributed);
                if (Math.abs(diff) >= 0.01 && items.length > 0) {
                    // aplicar la diferencia al primer item
                    distributed[0] = r2(distributed[0] + diff);
                }
                return items.map((it, idx) => ({ title: it.title, quantity: 1, price: +distributed[idx].toFixed(2) }));
            }
        }
    };

    const total = baseTotal;
    const itemCount = cart.length;

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            total,
            discount: +discount.toFixed(2),
            totalAfterDiscount: +totalAfterDiscount.toFixed(2),
            itemCount,
            isCartOpen,
            setIsCartOpen,
            activeCoupon,
            applyCoupon,
            removeCoupon,
            getCheckoutItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};