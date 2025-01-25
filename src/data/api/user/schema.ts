import * as yup from 'yup';
import { Location, User } from './inerfaces';

export const authSchema = yup.object({
  email: yup
    .string()
    .email('Email must be valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must include minimum letters'),
});

const locationSchema = yup.object<Location>({
  country: yup.string().required('location is required'),
  countryCode3: yup.string().required('location is required'),
  countryCode2: yup.string().required('location is required'),
  city: yup.string().required('location is required'),
  location: yup.string().required('location is required'),
});

export const userEditSchema = yup.object<Partial<User>>({
  userRole: yup.array(yup.string()).min(1, 'Choose your role').required(),
  individualStyles: yup
    .array(yup.string())
    .min(1, 'Choose your style')
    .required(),
  fullName: yup.string().required('user name is required'),
  gender: yup.string().required('choose your gender'),
  about: yup.string().optional().nullable(),
  fcmToken: yup.string().optional(),
  location: locationSchema.required('choose your location'),
  userImage: yup.string().optional(),
});

export type AuthSchema = yup.InferType<typeof authSchema>;
