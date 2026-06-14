
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import SessionProvider from "@/components/SessionProvider";
import LayoutContent from "@/components/LayoutContent";
import { CartProvider } from "@/lib/cart-context";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: 'crafts',
  description: 'gunnal-crafts',
  icons: {
    icon: '/logo.svg', // path from public folder
  },
};
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <LayoutContent>
              <Toaster position="top-right" />
              {children}
            </LayoutContent>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
