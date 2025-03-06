import Button from "./Button";

export default function TxSimulationResult({ result }) {


  return (
    <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md mt-6">
      <h2 className="text-white text-lg mb-4">Simulation Result</h2>
      <p className="text-green-400">Estimated Gas Fee: 24536 ETH</p>
      <p className="text-blue-400">Balance Change: 10 ETH</p>
    </div>
  );
}
