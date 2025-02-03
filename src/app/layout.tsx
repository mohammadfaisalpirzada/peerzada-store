// app/layout.tsx
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Providers } from "../app/providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}