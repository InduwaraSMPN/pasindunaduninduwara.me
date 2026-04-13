import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";
import { DevelopmentBanner } from "@/components/development-banner";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const bricolage = Bricolage_Grotesque({
	variable: "--font-bricolage",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
	variable: "--font-outfit",
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
			<body className={`${bricolage.variable} ${outfit.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<DevelopmentBanner />
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
