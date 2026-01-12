import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ 
  subsets: ["latin"],
  weight: "300", // This sets the light weight
  variable: "--font-inter", // Optional: used for CSS variables
});

export const metadata = {
  title: "One Hand",
  description: "A platform where one hand gives and another receives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-[#222222] bg-[#fae9d7]`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
