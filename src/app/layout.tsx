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
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        {/* Additional meta tags for SEO */}
        {/* Open Graph meta tags */}
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta
          property="og:image:width"
          content={metadata.openGraph.images[0].width.toString()}
        />
        <meta
          property="og:image:height"
          content={metadata.openGraph.images[0].height.toString()}
        />
        <meta property="og:site_name" content={metadata.openGraph.site_name} />
        {/* Twitter meta tags */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.images[0].url} />
        <meta
          name="twitter:image:width"
          content={metadata.twitter.images[0].width.toString()}
        />
        <meta
          name="twitter:image:height"
          content={metadata.twitter.images[0].height.toString()}
        />
      </head>
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
