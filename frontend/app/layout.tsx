import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

export const metadata: Metadata = {
  title: "VAULT | Luxury Streetwear",
  description: "High-end D2C streetwear platform featuring technical collections, smart sizing engines, and premium member exclusive access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
