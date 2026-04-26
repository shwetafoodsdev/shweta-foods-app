export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Shweta Foods";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Authentic Indian snacks — mini kachori, mini samosa, namkeen, khakhra, and more. Order fresh from Shweta Foods.";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT || 6);
export const DEAL_CREDIT_TEXT =
  process.env.NEXT_PUBLIC_DEAL_CREDIT_TEXT ||
  "Developed by Ritesh Sharma - Picoids Technology and Consulting Pvt. Ltd.";
export const DEAL_END_ISO = process.env.NEXT_PUBLIC_DEAL_END_ISO || "2027-01-01T00:00:00.000Z";
export const signInDefaultValues = {
  email: "",
  password: "",
};