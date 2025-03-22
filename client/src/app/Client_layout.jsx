"use client";
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WagmiProvider } from "wagmi";
import { config, web3ModalConfig } from "../../wagmi.config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function ClientLayout({ children }) {
  useEffect(() => {
    createWeb3Modal({
      wagmiConfig: config,
      projectId: web3ModalConfig.projectId,
      metadata: web3ModalConfig.metadata,
      enableAnalytics: true,
      themeMode: "dark", // Optional: for better visibility
      themeVariables: {
        "--w3m-z-index": 1000, // Ensure it appears above other elements
      },
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer />
      </QueryClientProvider>
    </WagmiProvider>
  );
}