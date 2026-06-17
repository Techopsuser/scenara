import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scenara — Real-world tech scenarios, solved together",
  description:
    "Scenara is a community platform where engineers share real production tech scenarios and collaborate on solutions. Browse, filter, and solve.",
  keywords: [
    "tech scenarios",
    "engineering",
    "solutions",
    "DevOps",
    "cloud",
    "developer community",
  ],
  authors: [{ name: "Scenara" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Scenara",
    description: "Real-world tech scenarios, solved together.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
