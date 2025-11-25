'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// --- Theme Context ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

// --- Language Context ---
export type Language = 'en' | 'ar' | 'fr' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const translations = {
    en: {
        'nav.home': 'Home',
        'nav.products': 'Products',
        'nav.cart': 'Cart',
        'nav.admin': 'Admin',
        'nav.signin': 'Sign In',
        'nav.signup': 'Sign Up',
        'hero.title': 'Welcome to Our Store',
        'hero.subtitle': 'Discover amazing products at unbeatable prices',
        'hero.shop': 'Shop Now',
        'featured.title': 'Featured Products',
        'footer.rights': 'All rights reserved.',
        'search.placeholder': 'Search products...',
        'filter.all': 'All',
        'cart.empty': 'Your Cart is Empty',
        'cart.clear': 'Clear Cart',
        'cart.total': 'Total',
        'cart.checkout': 'Proceed to Checkout',
        'product.add': 'Add to Cart',
        'product.stock': 'In Stock',
        'product.outstock': 'Out of Stock',
    },
    ar: {
        'nav.home': 'الرئيسية',
        'nav.products': 'المنتجات',
        'nav.cart': 'عربة التسوق',
        'nav.admin': 'المسؤول',
        'nav.signin': 'تسجيل الدخول',
        'nav.signup': 'إنشاء حساب',
        'hero.title': 'مرحباً بكم في متجرنا',
        'hero.subtitle': 'اكتشف منتجات مذهلة بأسعار لا تقبل المنافسة',
        'hero.shop': 'تسوق الآن',
        'featured.title': 'منتجات مميزة',
        'footer.rights': 'جميع الحقوق محفوظة.',
        'search.placeholder': 'البحث عن المنتجات...',
        'filter.all': 'الكل',
        'cart.empty': 'عربة التسوق فارغة',
        'cart.clear': 'إفراغ العربة',
        'cart.total': 'المجموع',
        'cart.checkout': 'متابعة الدفع',
        'product.add': 'أضف إلى العربة',
        'product.stock': 'متوفر',
        'product.outstock': 'غير متوفر',
    },
    fr: {
        'nav.home': 'Accueil',
        'nav.products': 'Produits',
        'nav.cart': 'Panier',
        'nav.admin': 'Admin',
        'nav.signin': 'Connexion',
        'nav.signup': "S'inscrire",
        'hero.title': 'Bienvenue dans notre boutique',
        'hero.subtitle': 'Découvrez des produits incroyables à des prix imbattables',
        'hero.shop': 'Acheter maintenant',
        'featured.title': 'Produits en vedette',
        'footer.rights': 'Tous droits réservés.',
        'search.placeholder': 'Rechercher des produits...',
        'filter.all': 'Tout',
        'cart.empty': 'Votre panier est vide',
        'cart.clear': 'Vider le panier',
        'cart.total': 'Total',
        'cart.checkout': 'Passer à la caisse',
        'product.add': 'Ajouter au panier',
        'product.stock': 'En stock',
        'product.outstock': 'Rupture de stock',
    },
    es: {
        'nav.home': 'Inicio',
        'nav.products': 'Productos',
        'nav.cart': 'Carrito',
        'nav.admin': 'Admin',
        'nav.signin': 'Iniciar Sesión',
        'nav.signup': 'Registrarse',
        'hero.title': 'Bienvenido a nuestra tienda',
        'hero.subtitle': 'Descubre productos increíbles a precios inmejorables',
        'hero.shop': 'Comprar ahora',
        'featured.title': 'Productos destacados',
        'footer.rights': 'Todos los derechos reservados.',
        'search.placeholder': 'Buscar productos...',
        'filter.all': 'Todos',
        'cart.empty': 'Tu carrito está vacío',
        'cart.clear': 'Vaciar carrito',
        'cart.total': 'Total',
        'cart.checkout': 'Proceder al pago',
        'product.add': 'Añadir al carrito',
        'product.stock': 'En stock',
        'product.outstock': 'Agotado',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return (translations[language] as any)[key] || key;
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [language, dir]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
