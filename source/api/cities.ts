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
  typeSearch?: string,
) => {
  const response = await axios.get(
    `${googleUrl}key=${GOOGLE_API_KEY}&address=${countyName}&types=${typeSearch}&components=country:${countyCode}&input=${searchString}`,
  );
  return response.data?.predictions;
};

export const searchPlaces = async (
  currentCity: string,
  cityName: string,
  searchString: string,
) => {
  const response = await axios.get(
    `${googleUrl}key=${GOOGLE_API_KEY}&language=en&address=${currentCity}&types=(cities)&components=country:USA&input=${cityName} ${searchString}`,
  );

  return response.data?.predictions;
};

export const searchPlacesInEvent = async (
  cityName: string,
  searchString: string,
  country: string,
) => {
  const response = await axios.get(
    `${googleUrl}key=${GOOGLE_API_KEY}&language=en&types=establishment&components=country:${country}&input=${cityName} ${searchString}`,
  );
  // console.log('dadad', response);
  return response.data?.predictions;
};
export const searchStateOfUSA = async (searchString: string) => {
  const response = await axios.get(
    `${googleUrl}key=${GOOGLE_API_KEY}&types=administrative_area_level_1&&components=country:USA&input=${searchString}&language=en`,
  );
  return response?.data?.predictions;
};

export const searchCity = async (
  searchString: string | undefined,
  countryCode: string,
) => {
  const response = await axios.get(
    `${googleUrl}key=${GOOGLE_API_KEY}&types=(cities)&components=country:${countryCode}&input=${searchString}&language=en`,
  );
  // console.log('re', response)
  return response.data?.predictions;
};
