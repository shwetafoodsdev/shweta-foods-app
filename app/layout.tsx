import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_NAME, SERVER_URL, APP_DESCRIPTION, DEAL_CREDIT_TEXT } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { AppToaster } from "@/components/app-toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  other: {
    "developer-credit": DEAL_CREDIT_TEXT,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} antialiased`}>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <AppToaster />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
