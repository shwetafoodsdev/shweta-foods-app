"use client";

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center gap-6 px-4">
            <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                width={60}
                height={60}
                priority
            />
            <div className="p-4 w-full max-w-md rounded-2xl shadow-lg border">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>

                <p className="text-muted-foreground mb-6">
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </p>

                <Button asChild >
                    <Link href="/">Go Back Home</Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
