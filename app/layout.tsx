import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"; // 1. IMPORT ANALYTICS
import "./globals.css";

export const metadata: Metadata = {
  title: "Collabs | E-Learning Initiative",
  icons: {
    icon: '/logo.png', 
    apple: '/logo.png',
  },
  description: "Collabs is a student-led digital learning and innovation ecosystem in Pakistan. Connect, learn, and build real-world technology through our secure E-Learning hub.",
  keywords: ["Collabs", "E-Learning Pakistan", "Student Innovation", "Digital Learning Hub", "Peer Mentorship", "EdTech Pakistan"],
  authors: [{ name: "Collabs Developers Community" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Collabs | E-Learning Initiative",
    description: "A 100% student-led digital learning and innovation ecosystem bridging the educational divide in Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collabs | E-Learning Initiative",
    description: "A 100% student-led digital learning and innovation ecosystem bridging the educational divide in Pakistan.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Collabs",
    "description": "A 100% student-led digital learning and innovation ecosystem bridging the geographical and educational divide across Pakistan.",
    "sameAs": [
      "https://www.instagram.com/akhsscollabs",
      "https://www.tiktok.com/@akhsscollabs",
      "https://www.youtube.com/@akhsscollabs"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics /> {/* 2. RENDER THE ANALYTICS WIDGET HERE */}
      </body>
    </html>
  );
}