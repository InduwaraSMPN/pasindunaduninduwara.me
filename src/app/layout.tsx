import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { DevelopmentBanner } from "@/components/development-banner";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

/**
 * Editorial Brutalism type system.
 *
 * - Archivo carries the display voice. It is a variable grotesque with a `wdth`
 *   axis, which lets headlines compress (wdth 92) while body copy stays at 100.
 * - Instrument Serif is used only for italic accents — a single emphasised word
 *   inside a headline, a pull quote. Never for body copy.
 * - IBM Plex Mono handles all metadata: section numbers, labels, dates, counts.
 */
const archivo = Archivo({
	variable: "--font-archivo",
	subsets: ["latin"],
	axes: ["wdth"],
	display: "swap",
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-serif",
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
	display: "swap",
});

const plexMono = IBM_Plex_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Pasindu Nadun Induwara — Software Engineer",
	description:
		"Software engineer building AI agents and QA automation end to end — at Marketrix until September 2026, before that at WSO2. A contributor to OpenChoreo and an AI Buildathon 2026 finalist.",
	metadataBase: new URL("https://pasindunaduninduwara.me"),
	openGraph: {
		title: "Pasindu Nadun Induwara — Software Engineer",
		description:
			"Software engineer building AI agents and QA automation — at Marketrix until September 2026, before that at WSO2, and a contributor to OpenChoreo.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`}>
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
