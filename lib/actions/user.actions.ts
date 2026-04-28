"use server";

import { signInFormSchema, signUpFormSchema } from "../validations";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { createAndSendEmailVerification, verifyEmailToken } from "@/lib/email-verification";

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, password: true, emailVerified: true },
    });
    if (!existingUser?.password) {
      return { success: false, message: "Invalid email or password" };
    }
    if (!existingUser.emailVerified) {
      return { success: false, message: "Please verify your email before signing in." };
    }

    await signIn("credentials", {
      ...user,
      redirectTo: "/",
    });
    return { success: true, message: "Signed in successfully " };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Let Next.js handle the redirect
    }
    const msg =
      error instanceof Error && error.message.includes("EMAIL_NOT_VERIFIED")
        ? "Please verify your email before signing in."
        : "Invalid email or password";
    console.error("Sign in error:", error);
    return { success: false, message: msg };
  }
}

// Sign user out
export async function signOutUser() {
  try {
    await signOut({ redirectTo: "/" });
    return { success: true, message: "Signed out successfully " };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, message: "Failed to sign out" };
  }
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, emailVerified: true },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashSync(user.password, 10),
          emailVerified: null,
        },
      });
    }

    // Security best-practice: avoid account enumeration.
    // If the user exists and is already verified, we still return a neutral success.
    if (!existingUser || !existingUser.emailVerified) {
      const { verifyUrl, delivered } = await createAndSendEmailVerification(user.email);
      if (!delivered) {
        console.warn(`[email] Email provider not configured; verification link for ${user.email}: ${verifyUrl}`);
      }
    }

    return {
      success: true,
      message: "Check your email to verify your account before signing in.",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Sign up error:", error);
    return { success: false, message: "Unable to create account" };
  }
}

export async function verifyEmail(prevState: unknown, formData: FormData) {
  try {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const token = String(formData.get("token") ?? "").trim();
    if (!email || !token) {
      return { success: false, message: "Invalid verification link." };
    }

    const result = await verifyEmailToken(email, token);
    if (!result.ok) {
      if (result.reason === "EXPIRED") {
        return { success: false, message: "Verification link expired. Please request a new one." };
      }
      return { success: false, message: "Invalid verification link." };
    }

    return { success: true, message: "Email verified successfully. You can now sign in." };
  } catch (error) {
    console.error("Verify email error:", error);
    return { success: false, message: "Unable to verify email. Please try again." };
  }
}

export async function resendEmailVerification(prevState: unknown, formData: FormData) {
  try {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    if (!email) {
      return { success: true, message: "If an account exists, we sent a verification email." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (user && !user.emailVerified) {
      const { verifyUrl, delivered } = await createAndSendEmailVerification(email);
      if (!delivered) {
        console.warn(`[email] Email provider not configured; verification link for ${email}: ${verifyUrl}`);
      }
    }

    return { success: true, message: "If an account exists, we sent a verification email." };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { success: true, message: "If an account exists, we sent a verification email." };
  }
}