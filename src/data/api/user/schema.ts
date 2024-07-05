import * as yup from 'yup';
import { EditUserRequest, UserLocation } from './inerfaces';

const locationSchema = yup.object<UserLocation>({
  country: yup.string().required('location is required'),
  countryCode3: yup.string().required('location is required'),
  countryCode2: yup.string().required('location is required'),
  city: yup.string().required('location is required'),
  location: yup.string().required('location is required'),
});

export const userEditSchema = yup.object<EditUserRequest>({
  userRole: yup.array(yup.string()).min(1, 'Choose your role').required(),
  individualStyles: yup
    .array(yup.string())
    .min(1, 'Choose your style')
    .required(),
  userName: yup.string().required('user name is required'),
  userGender: yup.string().required('choose your gender'),
  about: yup.string().optional(),
  fcmToken: yup.string().optional(),
  location: locationSchema.required('choose your location'),
  userImage: yup.string().optional(),
});
