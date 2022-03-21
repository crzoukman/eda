import * as yup from 'yup';

const nameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const validationSchema = yup.object({
  firstname: yup
    .string()
    .matches(nameRegex, "Enter a valid infromation")
    .min(1, 'A first name must contain at least 1 characters')
    .required('Have to enter a first name'),
  lastname: yup
    .string()
    .matches(nameRegex, "Enter a valid infromation")
    .min(1, 'A last name must contain at least 1 characters')
    .required('Have to enter a last name'),
  patronymic: yup
    .string()
    .matches(nameRegex, "Enter a valid infromation")
    .min(1, 'A patronymic must contain at least 1 characters')
    .required('Have to enter a patronymic'),
  question: yup
    .string(),
  answer: yup
    .string()
});