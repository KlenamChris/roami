import type { Metadata } from "next";
import { Imperial_Script } from "next/font/google";
import "./globals.css";


const imperial = Imperial_Script({
  display: 'swap',
  weight: '400',
  style: 'normal',
  subsets: ['latin']
}) 


export const metadata: Metadata = {
  title: "Roami",
  description: "Plan together. Go together. Remember forever.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${imperial.className} ${imperial.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col dot-background">{children}</body>
    </html>
  );
}
