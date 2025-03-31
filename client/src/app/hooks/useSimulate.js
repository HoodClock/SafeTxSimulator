"use client";
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";

export const useSimulate = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSimulation = useCallback(
    debounce((result) => {
      if (result?.error) {
        setError(result.error);
        setSimulationData({ ...result });
      } else {
        setError(null);
        setSimulationData(result);
      }
    }, 100),
    [] // Empty dependency array since setError and setSimulationData are stable
  );

  const resetSimulation = () => {
    setSimulationData(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    simulationData,
    isLoading,
    error,
    updateSimulation,
    setIsLoading,
    resetSimulation,
  };
};