import axios from 'axios';

const apiUrl = 'https://dance-connect-528e8b559e89.herokuapp.com';

type user = {
  email: string;
  password: string;
  userName: string;
  userGender: string;
  userCountry: string;
  userRole: string[];
  individualStyles: string[];
};
export const isUserExist = (email: string) => {
  axios
    .get(`${apiUrl}/userExist/${email}`)
    .then(result => result)
    .catch(er => console.log('error userexist', er));
};
export const login = async (email: string, password: string) => {
  try {
    const data_auth = {
      email: email,
      password: password,
    };
    const response = await axios.post(`${apiUrl}/auth/`, {
      data_auth: data_auth,
    });
    console.log('response', response);
    return response;
  } catch (er) {
    return console.log('er', er);
  }
};
export const createUser = async (data: user) => {
  try {
    const response = await axios.post(`${apiUrl}/users/`, {data: data});
    console.log('response', response);
    const {email, password} = data;
    login(email, password).then();
  } catch (er) {
    return console.log('er', er);
  }
};

export const getCommunitiesWithMongo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/communities/`);
    console.log('getCommunitiesWithMongo', response.data);
    return response?.data?.data;
  } catch (er) {
    return console.log('er', er);
  }
};
