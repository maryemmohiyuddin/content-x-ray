// Import required modules
import React from "react";
import "./globals.css"; // Import global CSS styles
import { Inter } from "next/font/google";
// Setup Inter font (assuming it's correctly imported)
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://content-x-ray.implementai.net/"),
  title: "Content X Ray",
  description:
    "Content X Ray - Instantly analyze your documents for deeper insights.",
  openGraph: {
    type: "website",
    site_name: "Content X Ray",
    title: "Instantly analyze your documents for deeper insights.",
    description:
      "Content X Ray - Instantly analyze your documents for deeper insights.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instantly analyze your documents for deeper insights.",
    description:
      "Content X Ray - Instantly analyze your documents for deeper insights.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
