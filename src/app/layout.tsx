import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Stadium — The Stadium is a Living Organism",
  description:
    "Real-time crowd intelligence, AI-powered operations, and the ultimate second-screen match day experience. Five interconnected systems, one living organism.",
  keywords: [
    "smart stadium",
    "live sports",
    "crowd intelligence",
    "digital twin",
    "match day experience",
  ],
  openGraph: {
    title: "Smart Stadium — The Stadium is a Living Organism",
    description:
      "Real-time crowd intelligence, AI-powered operations, and the ultimate second-screen match day experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0A0E17" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}
