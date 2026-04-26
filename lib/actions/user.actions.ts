"use server";

import { signInFormSchema, signUpFormSchema } from "../validations";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcrypt-ts-edge";

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

    await signIn("credentials", {
      ...user,
      redirectTo: "/",
    });
    return { success: true, message: "Signed in successfully " };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Let Next.js handle the redirect
    }
    console.error("Validation error:", error);
    return { success: false, message: "Invalid email or password" };
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
      select: { id: true },
    });

    if (existingUser) {
      return { success: false, message: "Email already in use" };
    }

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashSync(user.password, 10),
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirectTo: "/",
    });

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Sign up error:", error);
    return { success: false, message: "Unable to create account" };
  }
}