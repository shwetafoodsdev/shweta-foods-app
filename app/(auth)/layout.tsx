export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen w-full items-start justify-center px-4 py-10 sm:px-6 sm:py-14 md:items-center">
           {children}
        </div>
    );
}
