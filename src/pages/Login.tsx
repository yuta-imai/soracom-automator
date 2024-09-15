// src/pages/Login.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSoracomClient } from '../contexts/SoracomClientContext'; // コンテキストフックをインポート
import { SoracomClient } from '../services/SoracomClient';

const Login: React.FC = () => {
  const [accessKey, setAccessKey] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [coverageType, setCoverageType] = useState<string>('g'); // カバレッジタイプの選択肢（デフォルト値として 'g' を設定）
  const [error, setError] = useState<string>('');
  const { setClient } = useSoracomClient(); // SoracomClientのインスタンスをセットする関数を取得
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    console.log('handleLogin');
    e.preventDefault();
    setError('');

    try {
      // SoracomClientを初期化
      const soracomClient = new SoracomClient();

      // 認証を実行
      await soracomClient.authenticate(accessKey, secretKey, coverageType);

      // 認証成功後にクライアントインスタンスをコンテキストにセット
      setClient(soracomClient);

      // 次の画面（例えばUsageページ）にリダイレクト
      navigate('/usage');
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Access Key:</label>
          <input
            type="text"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Secret Key:</label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Coverage Type:</label>
          <select
            value={coverageType}
            onChange={(e) => setCoverageType(e.target.value)}
          >
            <option value="g">Global</option>
            <option value="jp">Japan</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
