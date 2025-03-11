// for handling globally the simulation data 

import { useState} from "react";


export const  useSimulate = ()=> {
    
    const [simulationData, setSimulationData] = useState(null);

    return {simulationData, setSimulationData}

}