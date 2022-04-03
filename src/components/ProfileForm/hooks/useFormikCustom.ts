import Api from "api";
import { useFormik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "../utils/validationSchema";
import { AppContext } from 'App';
import { IAppContext } from "types";
import { getCookie } from "utils/getCookie";

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

      async function updateProfile() {
        const token = getCookie('accessToken' + userData._id);

        try {
          await Api.updateProfile(
            {
              ...userData,
              firstname,
              lastname,
              patronymic,
              question,
              answer,
            },
            token
          );

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
            navigate('/');
          }, 3000);

        } catch (e: any) {
          if (!e.response) {
            setShowError(true);

            setTimeout(() => {
              setShowError(false);
            }, 3000);

          } else {
            const status = e.response.status;
            if (status === 403) {
              const token = getCookie('refreshToken' + userData._id);

              try {
                const res = await Api.refreshToken(token);

                if (res.data.accessToken) {
                  document.cookie = `accessToken${userData._id}=${res.data.accessToken}`;
                  updateProfile();
                }
              } catch (e: any) {
                const status = e.response.status;
                if (status === 401) {
                  setIsAuth(false);
                  localStorage.removeItem('userData');
                  navigate('/auth');
                }
              }
            } else {
              console.log('status is not 403');
            }
          }
        }
      }

      updateProfile();
    },
  });

  return formik;
}; 