// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Usage from './pages/Usage';
import { SoracomClientProvider } from './contexts/SoracomClientContext'; // コンテキストプロバイダーをインポート

const App: React.FC = () => {
  return (
    <SoracomClientProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/usage" element={<Usage />} />
          {/* 他のルートも同様に設定 */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </SoracomClientProvider>
  );
};

export default App;
