import nodemailer from "nodemailer";

export type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const anySmtpConfigured = Boolean(host || user || pass || from);
  const smtpFullyConfigured =
    Boolean(host && user && pass && from) && Number.isFinite(port) && port > 0;

  // Local/dev fallback: create a temporary Ethereal inbox so email flow can be tested
  // without configuring a real SMTP provider.
  if (!smtpFullyConfigured) {
    if (anySmtpConfigured) {
      throw new Error(
        "SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM."
      );
    }
    if (process.env.NODE_ENV === "production") {
      return { delivered: false as const, reason: "EMAIL_NOT_CONFIGURED" as const };
    }

    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: from || `Shweta Foods <${testAccount.user}>`,
      to,
      subject,
      html,
      text,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.info(`[email][dev] Preview email URL: ${previewUrl}`);
    }

    return { delivered: true as const };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });

  return { delivered: true as const };
}

export function getAppBaseUrl() {
  // Prefer the explicit public server URL you already use in the app.
  // In production, set NEXT_PUBLIC_SERVER_URL to the canonical origin (https://...).
  return process.env.NEXT_PUBLIC_SERVER_URL?.trim() || "http://localhost:3000";
}
