import * as yup from 'yup';

const nameRegex =
  /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const validationSchema = yup.object({
  firstname: yup
    .string()
    .matches(nameRegex, 'Enter a valid infromation'),

  lastname: yup
    .string()
    .matches(nameRegex, 'Enter a valid infromation'),

  patronymic: yup
    .string()
    .matches(nameRegex, 'Enter a valid infromation'),

  question: yup.string(),
  answer: yup.string(),
});
