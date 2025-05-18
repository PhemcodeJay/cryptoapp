import axios from 'axios';

const analyze = async (symbol) => {
  const res = await axios.get('/api/bot/analyze?symbol=' + symbol);
  return res.data;
};

export default { analyze };
