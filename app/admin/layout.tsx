'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAdmin, loading } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();

    // Force dark mode in admin panel
    useEffect(() => {
        // Always remove light class to force dark mode
        document.documentElement.classList.remove('light');

        // Cleanup: restore the user's preferred theme when leaving admin
        return () => {
            if (theme === 'light') {
                document.documentElement.classList.add('light');
            }
        };
    }, [theme]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/');
            }
        }
    }, [user, isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        // Force "dark" class here to ensure all shadcn components (Buttons, Inputs) 
        // use dark theme variables (bg-background = dark) regardless of user's public site preference.
        <div className="dark min-h-screen flex flex-col bg-slate-950 text-slate-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex justify-between items-center border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Pharmacy Admin</h1>
                        <p className="text-xs text-slate-400">Management Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="/"
                        target="_blank"
                        className="text-sm text-slate-300 hover:text-white border border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                        View Site
                    </a>
                    <span className="hidden sm:block text-sm text-slate-400">{user?.email}</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
