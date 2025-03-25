"use client";
import { useState } from "react";

export const useSimulate = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSimulation = (result) => {
    if (result?.error) {
      setError(result.error);
      setSimulationData({
        ...result,
        transactionStatus: "Will Fail"
      });
    } else {
      setError(null);
      setSimulationData(result);
    }
  };

  const resetSimulation = () => {
    setSimulationData(null);
    setError(null);
  };

  return { 
    simulationData, 
    isLoading, 
    error, 
    updateSimulation,
    setIsLoading,
    resetSimulation 
  };
};