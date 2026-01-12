import "./globals.css";

export const metadata = {
  title: "One Hand",
  description: "A platform where one hand gives and another receives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#fae9d7] text-[#222]">
        <main>{children}</main>
      </body>
    </html>
  );
}
