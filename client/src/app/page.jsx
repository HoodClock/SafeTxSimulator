import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TxInputForm from "./components/InputForm";
import TxSimulationResult from "./components/TxSimResult";
import WalletConnect from "./components/WalletConnect";
import ParticlesWrapper from "./components/ParticlesWrapper";


export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A535C] to-[#4FD1C5] text-white">
      {/* Particles Background */}
      <ParticlesWrapper />

      {/* Content */}
      <div className="relative z-10 grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-10 gap-12 sm:p-20">
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






// export default function Home() {
//   return (
//     <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-10 gap-12 sm:p-20 bg-gradient-to-br from-[#0A2E36] via-[#1A535C] to-[#0D0D0D] text-white">
//       <Navbar />

//       <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
//         <WalletConnect />
//         <TxInputForm />
//         <TxSimulationResult />
//       </div>

//       <Footer />
//     </div>
//   );
// }