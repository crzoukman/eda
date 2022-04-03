import { useFormik } from "formik";
import { validationSchema } from "../utils/validationSchema";
import Api from 'api';
import React from 'react';
import { AppContext } from 'App';
import { IAppContext } from 'types';
import { useNavigate } from 'react-router-dom';

export const useFormikCustom = (...args: any) => {
  const setIsCreatingUser = args[0];
  const { setIsAuth } = React.useContext(AppContext) as IAppContext;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      changepassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const {
        username,
        email,
        password,
        changepassword,
      } = values;

      setIsCreatingUser(true);

      const res = await Api.createUser({
        username,
        password,
        passwordConfirmation: changepassword,
        email,
      });

      const res2 = await Api.login({ username, password });

      setIsCreatingUser(false);

      if (res?.status === 200) {
        localStorage.setItem('userData', JSON.stringify({ ...res.data, token: res2?.data }));
        setIsAuth(true);
        navigate('/');
      }

      if (res?.status === 210) {
        console.log(res.data);
      }

    },
  });

  return formik;
};