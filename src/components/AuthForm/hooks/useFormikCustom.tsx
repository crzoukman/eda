import Api from "api";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IAppContext } from "types";
import { validationSchema } from "../utils/validationSchema";
import { AppContext } from 'App';
import { omit } from "../utils/omit";

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

      try {
        const res = await Api.login({
          username,
          password,
        });

        document.cookie = `refreshToken${res.data._id}=${res.data.refreshToken}`;
        document.cookie = `accessToken${res.data._id}=${res.data.accessToken}`;

        const omitted = omit(res.data, ['refreshToken', 'accessToken']);

        localStorage.setItem(
          'userData',
          JSON.stringify({ ...omitted })
        );

        setIsAuth(true);
        navigate('/');
      } catch (e) {
        console.log(e);
      }

      setIsSigningIn(false);

    },
  });

  return formik;
}; 