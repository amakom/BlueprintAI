import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { AuthProvider } from '@/components/providers/auth-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlueprintAI - AI-Powered Project Planning",
    template: "%s | BlueprintAI",
  },
  description: "Transform your ideas into actionable project blueprints with AI-powered planning, real-time collaboration, and intelligent project management.",
  keywords: ["project planning", "AI", "blueprint", "project management", "collaboration", "agile"],
  authors: [{ name: "BlueprintAI" }],
  creator: "BlueprintAI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://blueprintai.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blueprintai.dev",
    siteName: "BlueprintAI",
    title: "BlueprintAI - AI-Powered Project Planning",
    description: "Transform your ideas into actionable project blueprints with AI-powered planning.",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: "BlueprintAI Logo" }],
  },
  twitter: {
    card: "summary",
    title: "BlueprintAI - AI-Powered Project Planning",
    description: "Transform your ideas into actionable project blueprints with AI-powered planning.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
