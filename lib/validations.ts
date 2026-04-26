import { z } from "zod";

export const insertProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
    images: z.array(z.string()).min(1, "At least one image URL is required"),
    price: z.number().int().nonnegative("Price must be a non-negative number"),
    brand: z.string().min(1, "Brand is required"),
    rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
    numReviews: z.number().int().nonnegative("Number of reviews must be a non-negative integer").optional(),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    isVisiable: z.boolean(),
    isDealOfDay: z.boolean(),
    dealEndsAt: z.date().nullable().optional(),
    banner: z.string().optional(),
});

export type InsertProductInput = z.infer<typeof insertProductSchema>;

export const signInFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignInFormInput = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignUpFormInput = z.infer<typeof signUpFormSchema>;

export const siteSettingsSchema = z.object({
    shippingCharge: z.number().int().nonnegative("Shipping charge must be 0 or more"),
    taxRate: z.number().int().min(0, "Tax rate must be between 0 and 100").max(100, "Tax rate must be between 0 and 100"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;