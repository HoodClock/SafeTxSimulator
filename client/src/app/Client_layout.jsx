"use client";
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

// Initialize Web3Modal immediately when the module loads
console.log("Initializing Web3Modal with projectId:", web3ModalConfig.projectId);
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: web3ModalConfig.projectId,
  metadata: web3ModalConfig.metadata,
  enableAnalytics: true,
  themeMode: "dark",
  themeVariables: {
    "--w3m-z-index": 1000,
  },
});
console.log("Web3Modal instance created:", modal);

export default function ClientLayout({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer />
      </QueryClientProvider>
    </WagmiProvider>
  );
}