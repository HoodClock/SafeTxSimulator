export default function TxSimulationResult({ simulationData }) { 
  if (!simulationData) {
    return <div className="text-white">No simulation data available</div>;
  }

  return (
    <div className="p-6 w-full max-w-md mt-6 flex flex-col gap-4">
      <h2 className="text-yellow-400 text-lg mb-4">Simulation Result</h2>
      {Object.entries(simulationData).map(([key, value]) => (
        <div
          key={key}
          className="border border-white rounded p-4 bg-transparent"
        >
          <p className="text-yellow-400 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
            <span className="text-white">{value.toString()}</span>
          </p>
        </div>
      ))}
    </div>
  );
}