import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getAppBaseUrl, sendEmail } from "@/lib/email";
import { APP_NAME } from "@/lib/constants";

const EMAIL_VERIFICATION_TTL_MINUTES = 60;

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function newRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function buildVerifyEmailUrl(email: string, token: string) {
  const base = getAppBaseUrl();
  const url = new URL("/verify-email", base);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function createAndSendEmailVerification(email: string) {
  const rawToken = newRawToken();
  const tokenHash = sha256(rawToken);
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MINUTES * 60 * 1000);

  // One active token per email to reduce abuse + simplify UX.
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: tokenHash,
      expires,
    },
  });

  const verifyUrl = buildVerifyEmailUrl(email, rawToken);
  const subject = `Verify your email for ${APP_NAME}`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Verify your email</h2>
      <p style="margin: 0 0 16px;">Thanks for creating an account on ${APP_NAME}. Please verify your email address to activate your account.</p>
      <p style="margin: 0 0 20px;">
        <a href="${verifyUrl}" style="background: #111827; color: white; padding: 10px 14px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Verify email
        </a>
      </p>
      <p style="margin: 0 0 6px; color: #6b7280; font-size: 12px;">This link expires in ${EMAIL_VERIFICATION_TTL_MINUTES} minutes.</p>
      <p style="margin: 0; color: #6b7280; font-size: 12px;">If you did not create this account, you can safely ignore this email.</p>
    </div>
  `.trim();
  const text = `Verify your email for ${APP_NAME}: ${verifyUrl} (expires in ${EMAIL_VERIFICATION_TTL_MINUTES} minutes)`;

  const result = await sendEmail({ to: email, subject, html, text });
  return { verifyUrl, delivered: result.delivered };
}

export async function verifyEmailToken(email: string, rawToken: string) {
  const tokenHash = sha256(rawToken);
  const row = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: tokenHash } },
  });

  if (!row) {
    return { ok: false as const, reason: "INVALID" as const };
  }

  if (row.expires.getTime() < Date.now()) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    return { ok: false as const, reason: "EXPIRED" as const };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    return { ok: false as const, reason: "INVALID" as const };
  }

  await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  return { ok: true as const };
}

