// Import required modules
import React from "react";
import "./globals.css"; // Import global CSS styles
import { Inter } from "next/font/google";
// Setup Inter font (assuming it's correctly imported)
const inter = Inter({ subsets: ["latin"] });

// Define metadata for SEO and social sharing
export const metadata = {
  title: "Content X Ray",
  description: "Instantly analyze your documents for deeper insights.",
  openGraph: {
    type: "website",
    site_name: "Content X Ray",
    title: "Content X Ray",
    description: "Instantly analyze your documents for deeper insights.",
    images: [
      {
        url: "/opengraph.png", // Update with your actual image URL
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Content X Ray",
    description: "Instantly analyze your documents for deeper insights.",
    images: [
      {
        url: "/opengraph.png", // Update with your actual image URL
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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
