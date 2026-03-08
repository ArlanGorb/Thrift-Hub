import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Thrift Hub – Sustainable Online Thrift Fashion',
  description:
    'Browse and buy quality second-hand clothing at Thrift Hub. Shop T-shirts, hoodies, jackets, sweaters, vintage clothing, and jeans sustainably.',
  keywords: 'thrift store, second hand clothes, vintage fashion, sustainable fashion, used clothing',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#4a7c59', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
