import React, { useState } from 'react';
import botService from '../services/botService';

export default function BotConfigPage() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);

  const analyze = async () => {
    const result = await botService.analyze(symbol);
    setData(result);
  };

  return (
    <div>
      <h2>Bot Config</h2>
      <input placeholder="Symbol e.g. BTCUSDT" value={symbol} onChange={e => setSymbol(e.target.value)} />
      <button onClick={analyze}>Analyze</button>
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
