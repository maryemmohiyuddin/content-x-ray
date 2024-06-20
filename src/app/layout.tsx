import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content X Ray",
  description: "Instantly analyze your documents for deeper insights.",
  openGraph: {
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 800,
        alt: "Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/twitter.png",
        width: 1200,
        height: 630,
        alt: "Twitter Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
       
        <meta property="og:image" content="/opengraph.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/twitter.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
