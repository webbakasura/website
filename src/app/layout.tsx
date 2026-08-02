import type { Metadata, Viewport } from "next";
import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bakasura Biryani | Eat Like a King",
  description:
    "Royal dum-cooked biryani, slow-cooked with secret spices fit for a king. Once you start, you can't stop. Order Bakasura Biryani today.",
  icons: {
    icon: "/images/logo-transparent-v2.png",
  },
  openGraph: {
    title: "Bakasura Biryani | Eat Like a King",
    description:
      "Royal dum-cooked biryani, slow-cooked with secret spices fit for a king.",
    images: ["/images/logo-v2.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf6ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable}`}>
      <body className="min-h-full bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
