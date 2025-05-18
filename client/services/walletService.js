import axios from 'axios';

const getWallets = async () => {
  const res = await axios.get('/api/wallets');
  return res.data;
};

export default { getWallets };
