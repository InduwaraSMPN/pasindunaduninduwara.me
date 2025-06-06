import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { DevelopmentBanner } from "@/components/development-banner";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pasindu Nadun Induwara - Digital Designer",
  description: "Portfolio website showcasing digital design projects and blog posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DevelopmentBanner />
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
