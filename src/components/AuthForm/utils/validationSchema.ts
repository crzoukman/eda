import * as yup from 'yup';

const nameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const validationSchema = yup.object({
  username: yup
    .string()
    .matches(nameRegex, "Enter a valid username")
    .min(6, 'A username must contain at least 6 characters')
    .required('Have to enter a username'),
  password: yup
    .string()
    .min(8, 'A password must contain at least 8 characters')
    .required('Have to enter a password'),
});