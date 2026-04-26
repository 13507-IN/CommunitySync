import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommunitySync - Community Empowerment Platform",
  description: "Report, track, and resolve community issues with transparency and speed.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased">
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
