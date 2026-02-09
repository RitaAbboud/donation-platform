import { Poppins } from "next/font/google";
import "./globals.css";

import { SearchProvider } from "../context/SearchContext";

const inter = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

export const metadata = {
  title: "One Hand",
  description: "A platform where one hand gives and another receives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-[#222222]`}>
        <SearchProvider>
          <main>{children}</main>
        </SearchProvider>
      </body>
    </html>
  );
}