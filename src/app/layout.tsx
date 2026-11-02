import type { Metadata } from "next";
import { Caveat, Outfit } from "next/font/google";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import "./globals.css";

// Same typefaces as the landing page.
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Chilla demo: find the person who knows",
  description: "Interactive prototype of Chilla inside a simulated Slack workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${caveat.variable} antialiased`}>
      <body className="font-sans">
        <WorkspaceProvider>
          <WorkspaceShell>{children}</WorkspaceShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
