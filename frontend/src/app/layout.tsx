import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';

import "./globals.css";
import ReactQueryProvider from "@/components/ReactQueryWrapper/ReactQueryWrapper";

const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-primary'
})

export const metadata: Metadata = {
	title: "FPWD Assignment - Dominik Augustyn",
	description: "EUR-PLN Exchange Application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${montserrat.variable}`}>
			<body>
				<ReactQueryProvider>
					{children}
				</ReactQueryProvider>
			</body>
		</html>
	);
}
