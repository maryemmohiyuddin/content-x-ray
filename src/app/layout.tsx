import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Content X Ray",
//   description: "Instantly analyze your documents for deeper insights.",
//   openGraph: {
//     images: [
//       {
//         url: "/opengraph.png",
//         width: 1200,
//         height: 800,
//         alt: "Open Graph Image",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     images: [
//       {
//         url: "/twitter.png",
//         width: 1200,
//         height: 630,
//         alt: "Twitter Image",
//       },
//     ],
//   },
// };
export const metadata = {
  metadataBase: new URL("https://content-x-ray.implementai.net/"),
  title: "Content X Ray",
  description: "Instantly analyze your documents for deeper insights.",
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
