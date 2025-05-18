import axios from 'axios';

const login = async (data) => {
  await axios.post('/api/auth/login', data, { withCredentials: true });
};

export default { login };
