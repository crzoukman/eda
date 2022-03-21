import Api from "api";
import { useFormik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "../utils/validationSchema";
import { AppContext } from 'App';
import { IAppContext } from "types";

export const useFormikCustom = (...args: any) => {
  const setIsSending = args[0];
  const setShowSuccess = args[1];
  const setShowError = args[2];
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AppContext) as IAppContext;

  const userData = JSON.parse(localStorage.getItem('userData') as string);

  const formik = useFormik({
    initialValues: {
      firstname: userData.firstname || '',
      lastname: userData.lastname || '',
      patronymic: userData.patronymic || '',
      question: userData.question || '',
      answer: userData.answer || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const {
        firstname,
        lastname,
        patronymic,
        question,
        answer,
      } = values;

      try {
        const res = await Api.updateProfile({
          ...userData,
          firstname,
          lastname,
          patronymic,
          question,
          answer,
        });

        if (res && res !== 403) {
          localStorage.setItem('userData', JSON.stringify({
            ...userData,
            firstname,
            lastname,
            patronymic,
            question,
            answer,
          }));

          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        } else {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
            if (res === 403) {
              setIsAuth(false);
              localStorage.removeItem('userData');
              navigate('/');
            }
          }, 3000);
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }


    },
  });

  return formik;
}; 