import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TxInputForm from "./components/InputForm";
import TxSimulationResult from "./components/TxSimResult";
import WalletConnect from "./components/WalletConnect";


export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0F0F13] text-white">
    {/* Glow effects */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#2A0D67] blur-[90px] opacity-30"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#0066FF] blur-[90px] opacity-20"></div>
    </div>
  
    {/* Content */}
    <div className="relative z-10 grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-6 gap-8 sm:p-10 md:gap-12">
      <Navbar />
  
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
        <WalletConnect />
        <TxInputForm />
        <TxSimulationResult />
      </div>
  
      <Footer />
    </div>
  </div>
  );
}