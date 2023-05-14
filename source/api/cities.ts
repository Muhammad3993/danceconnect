import axios from 'axios';
import {GOOGLE_API_KEY} from '../utils/constants';

const url = 'https://shivammathur.com/countrycity/cities/';
const googleUrl =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
export const getCities = async (countyName: string) => {
  const result = await axios.get(`${url}${countyName}`);
  return result?.data;
};
// https://maps.googleapis.com/maps/api/place/autocomplete/json?address=argentina&key=AIzaSyAaMUmA9rKPazM7tBeEEelzUuonq4hrxUk&types=(cities)&components=country:AR&input=ar

export const searchCities = async (
  countyName: string,
  countyCode: string,
  searchString: string,
) => {
  const response = await axios.get(
    `${googleUrl}key=${GOOGLE_API_KEY}&address=${countyName}&types=(cities)&components=country:${countyCode}&input=${searchString}`,
  );
  return response.data?.predictions;
};
