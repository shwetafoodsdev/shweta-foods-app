import Footer from "@/components/footer";
import Header from "@/components/shared/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="wrapper flex-1 pb-14 pt-44 md:pt-24">{children}</main>
      <Footer />
    </div>
  );
}
