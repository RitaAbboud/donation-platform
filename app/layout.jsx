import { Poppins } from "next/font/google";
import "./globals.css";
// 1. Import the Provider (Check the path to match your folder structure)
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
        {/* 2. Wrap the children so Dashboard and other pages can "see" the search state */}
        <SearchProvider>
          <main>{children}</main>
        </SearchProvider>
      </body>
    </html>
  );
}