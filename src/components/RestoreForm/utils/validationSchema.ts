import * as yup from 'yup';

const nameRegex =
  /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export const validationSchema = yup.object({
  answer: yup.string(),
  password: yup
    .string()
    .min(6, 'A password must contain at least 6 characters')
    .required('Have to enter a password'),
  passwordConfirmation: yup
    .string()
    .min(6, 'A password must contain at least 6 characters')
    .required('Have to enter a password confirmation')
    .when('password', {
      is: (val: string) =>
        val && val.length > 0 ? true : false,
      then: yup
        .string()
        .oneOf(
          [yup.ref('password')],
          'Passwords must be equal',
        ),
    }),
});
