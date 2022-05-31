import { useFormik } from 'formik';
import { validationSchema } from '../utils/validationSchema';
import Api from 'api';
import React, { useEffect, useRef, useState } from 'react';
import { AppContext } from 'App';
import { IAppContext } from 'types';
import { useNavigate } from 'react-router-dom';
import { saveTokenToCookie } from 'utils/saveTokenToCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { config } from 'config';

export const useFormikCustom = (...args: any) => {
  const setIsCreatingUser = args[0];
  const setError = args[1];
  const { setIsAuth } = React.useContext(
    AppContext,
  ) as IAppContext;
  const navigate = useNavigate();
  const timeoutId = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      changepassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { username, email, password, changepassword } =
        values;

      setIsCreatingUser(true);

      const res = await Api.createUser({
        username,
        password,
        passwordConfirmation: changepassword,
        email,
      });

      setIsCreatingUser(false);

      if (res.status !== 201) {
        setError(res.status);
        timeoutId.current = setTimeout(() => {
          setError(null);
        }, config.ALERT_DELAY);
      }

      if (res.status === 201) {
        localStorage.setItem(
          'userData',
          JSON.stringify({
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
          }),
        );

        const username = getUsernameFromLS();
        saveTokenToCookie(
          res.data.refresh_token,
          username,
          'rt',
        );
        saveTokenToCookie(
          res.data.access_token,
          username,
          'at',
        );

        setIsAuth(true);
        navigate('/');
      }
    },
  });

  return formik;
};
