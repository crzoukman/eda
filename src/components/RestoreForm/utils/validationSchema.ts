import * as yup from 'yup';

const nameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const validationSchema = yup.object({
  answer: yup
    .string(),
  password: yup
    .string()
    .min(8, 'A password must contain at least 8 characters')
    .required('Have to enter a password'),
});