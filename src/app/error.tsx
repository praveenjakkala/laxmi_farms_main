'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('App Error:', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-warm-900 mb-2">Something went wrong!</h2>
                <p className="text-warm-500 mb-6 text-sm">
                    We encountered an unexpected error. Please try again or return to the homepage.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-sm"
                    >
                        <RefreshCcw className="w-4 h-4" /> Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-warm-100 text-warm-700 font-semibold rounded-xl hover:bg-warm-200 transition-colors text-sm"
                    >
                        <Home className="w-4 h-4" /> Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
