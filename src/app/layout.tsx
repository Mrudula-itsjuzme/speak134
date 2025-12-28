import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MisSpoke - Master a New Language by Speaking",
  description: "Voice-first AI language learning that adapts to you. Practice speaking with AI tutors that remember, adapt, and evolve.",
  keywords: ["language learning", "AI tutor", "voice learning", "speak to learn", "ElevenLabs"],
  openGraph: {
    title: "MisSpoke - Master a New Language by Speaking",
    description: "Voice-first AI language learning that adapts to you",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
