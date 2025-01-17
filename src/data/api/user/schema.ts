import * as yup from 'yup';

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

export type AuthSchema = yup.InferType<typeof authSchema>;
