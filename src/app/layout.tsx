
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from 'react-hot-toast';
import SessionProvider from "@/components/SessionProvider";
import LayoutContent from "@/components/LayoutContent";
import { auth } from "@/lib/auth";
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



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error('Session error:', error);
    session = null;
  }
  
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
