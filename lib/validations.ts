import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((v) => v.toLowerCase());

const realisticNameSchema = z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters")
    .regex(/^[\p{L}]+(?: [\p{L}]+)*$/u, "Name must contain letters and spaces only");

const personNamePartSchema = z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(40, "Must be at most 40 characters")
    .regex(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, "Use letters only (spaces, apostrophes, hyphens allowed)");

const countryCodeSchema = z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Invalid country code");

const phoneSchema = z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, "Phone number must contain 7 to 15 digits")
    .refine((value) => !/^0+$/.test(value), "Phone number cannot be all zeros");

const postalCodeSchema = z
    .string()
    .trim()
    .regex(/^\d{4,10}$/, "Postal code must contain 4 to 10 digits")
    .refine((value) => !/^0+$/.test(value), "Postal code cannot be all zeros");

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
    email: emailSchema,
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignInFormInput = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
    name: realisticNameSchema,
    email: emailSchema,
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignUpFormInput = z.infer<typeof signUpFormSchema>;

export const shippingAddressSchema = z.object({
    firstName: personNamePartSchema,
    lastName: personNamePartSchema,
    address1: z.string().trim().min(5, "Address line 1 must be at least 5 characters").max(120, "Address line 1 is too long"),
    address2: z.string().trim().max(120, "Address line 2 is too long").optional().or(z.literal("")),
    city: z.string().trim().min(2, "City is required").max(80, "City is too long"),
    state: z.string().trim().min(2, "State is required").max(80, "State is too long"),
    postalCode: postalCodeSchema,
    country: z.string().trim().min(2, "Country is required").max(80, "Country is too long"),
    countryCode: countryCodeSchema,
    phone: phoneSchema,
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const siteSettingsSchema = z.object({
    shippingCharge: z.number().int().nonnegative("Shipping charge must be 0 or more"),
    taxRate: z.number().int().min(0, "Tax rate must be between 0 and 100").max(100, "Tax rate must be between 0 and 100"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;