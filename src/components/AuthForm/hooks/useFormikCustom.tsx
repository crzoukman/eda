import Api from "api";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IAppContext } from "types";
import { validationSchema } from "../utils/validationSchema";
import { AppContext } from 'App';

export const useFormikCustom = (...args: any) => {
  const setIsSigningIn = args[0];
  const { setIsAuth } = React.useContext(AppContext) as IAppContext;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const {
        username,
        password,
      } = values;

      setIsSigningIn(true);

      const res = await Api.login({
        username,
        password,
      });

      setIsSigningIn(false);

      if (res?.data) {
        const { token, _id, firstname, lastname, question, answer, patronymic } = res.data;

        if (res.status === 200) {
          localStorage.setItem('userData', JSON.stringify({ username, token, _id, firstname, lastname, question, answer, patronymic }));
          setIsAuth(true);
          navigate('/');
        }
      }

    },
  });

  return formik;
}; 