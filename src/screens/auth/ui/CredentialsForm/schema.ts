import * as yup from 'yup';

export const authSchema = yup.object({
  email: yup.string().email().required('location is required'),
  password: yup
    .string()
    .required('location is required')
    .min(6, 'Password must include minimum letters'),
});

export type AuthSchema = yup.InferType<typeof authSchema>;
