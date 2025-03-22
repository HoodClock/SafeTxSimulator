// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from './Client_layout'

export const metadata = {
  title: "Safe Transaction Simulator",
  description: "Try to simulate the transaction without even spending any penny.",
  icons: {
    icon: '/favicon.ico',
  }
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayoutServer({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}