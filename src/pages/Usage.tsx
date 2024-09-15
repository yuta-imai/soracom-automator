// src/pages/Usage.tsx
import React, { useState } from 'react';
import SimSearchList from '../components/SimSearchList';
import { useSoracomClient } from '../contexts/SoracomClientContext';
import { Sim } from '../services/SoracomClient';
import { useNavigate } from 'react-router-dom';

const Usage: React.FC = () => {
  const { client } = useSoracomClient(); // SoracomClientのインスタンスを取得
  const [simResults, setSimResults] = useState<Sim[]>([]); 
  const navigate = useNavigate();

  if (!client) {
    navigate('/login');
  }

  const handleSimResults = (sims: Sim[]) => {
    setSimResults(sims);
  };


  return (
    <div>
      <h1>SIM Search Application</h1>

      {/* SimSearchListコンポーネントを使用し、検索結果を受け取る */}
      <SimSearchList client={client!} onResults={handleSimResults} />

      {/* 外部コンポーネントで結果を表示 */}
      {simResults.length > 0 && (
        <div>
          <h2>SIMs from Parent Component:</h2>
          <ul>
            {simResults.map((sim) => (
              <li key={sim.simId}>
                {sim.simId} - {sim.status} - {sim.primaryImsi}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Usage;
