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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <div className="flex flex-col items-center gap-8">
        <WalletConnect />
        <TxInputForm />
        <TxSimulationResult />
        {/* <Loader /> */}
      </div>

      <Footer />

    </div>
  );
}
