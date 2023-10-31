import axios from 'axios';
import { USERS_URL } from '../Utils/UrlConstants'; 

const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${USERS_URL}/${userId}`);
    return response.data;
  } catch (error) {
    return {
      isError: true,
      message: 'Error deleting user',
    };
  }
};

export default deleteUser;