import type { Metadata } from "next";
import { Inter, Irish_Grover } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const irishGrover = Irish_Grover({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-irish"
});

export const metadata: Metadata = {
  title: "MindGroup - TechBlog",
  description: "Seu portal de tecnologia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${irishGrover.variable} font-sans bg-[#0B0E13] text-white`}>
        {children}
      </body>
    </html>
  );
}