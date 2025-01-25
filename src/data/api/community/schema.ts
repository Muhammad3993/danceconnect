import * as yup from 'yup';

export const communitySchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  location: yup.string().required('Choose community location'),
  images: yup.array(yup.string().required()).required(),
  categories: yup
    .array(yup.string().required())
    .min(1, 'Choose Community Category')
    .required(),
});

export type CommunitySchema = yup.InferType<typeof communitySchema>;
