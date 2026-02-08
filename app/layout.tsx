import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AIChatButton from '@/components/AIChatButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Farooq Pharmacy - Dera Ghazi Khan',
  description: 'Your trusted partner in health. Located at BLOCK NO 8 NEAR PAKISTANI CHOWK DERA GAZI, Dera Ghazi Khan, 32200.',
  keywords: 'pharmacy, medicine, dera ghazi khan, health, store, online pharmacy',
  verification: {
    google: 'XjyzzrgjaWXxgj5VVvSlx359h5GFQtExsF-MknXQJQs',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <AIChatButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
