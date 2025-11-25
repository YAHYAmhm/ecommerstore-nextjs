import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// Password validation
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

// Sign up validation
export const signUpSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Sign in validation
export const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

// Forgot password validation
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// Reset password validation
export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Product validation
export const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    image: z.string().url('Invalid image URL'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
});

// Shipping address validation
export const shippingAddressSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
});

// Checkout validation
export const checkoutSchema = z.object({
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery']),
});

// Helper function to validate email
export function isValidEmail(email: string): boolean {
    return emailSchema.safeParse(email).success;
}

// Helper function to check password strength
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    if (password.length < 8) return 'weak';

    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
}
