import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FONGIT — Application Portal",
  description:
    "Apply for FONGIT startup support. We help entrepreneurs transform innovative ideas into sustainable Swiss companies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
