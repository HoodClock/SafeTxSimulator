import Image from "next/image";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import Card from "./components/Card";
import Footer from "./components/Footer";
import TxInputForm from "./components/InputForm";
import Loader from "./components/Loader";
import TxSimulationResult from "./components/TxSimResult";
import WalletConnect from "./components/WalletConnect";


export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-10 gap-12 sm:p-20 bg-[#0D0D0D] text-white">
    <Navbar />
  
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      <WalletConnect />
      <TxInputForm />
      <TxSimulationResult />
    </div>
  
    <Footer />
  </div>
  );
}
