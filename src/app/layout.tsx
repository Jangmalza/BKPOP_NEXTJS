import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "보광 - 국민인쇄몰 | 빠른 납기, 합리적인 가격",
  description: "명함, 전단, 브로셔, 패키지 등 모든 인쇄물을 빠르고 합리적인 가격으로 제작해드립니다. 당일 출고부터 3일 이내 완성까지 다양한 납기 옵션을 제공합니다.",
  keywords: "인쇄, 명함, 전단, 브로셔, 패키지, 상업인쇄, 디지털인쇄, 보광",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
