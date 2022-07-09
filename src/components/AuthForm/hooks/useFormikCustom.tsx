import Api from 'api';
import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAppContext } from 'types';
import { validationSchema } from '../utils/validationSchema';
import { AppContext } from 'App';
import jwt_decode from 'jwt-decode';
import { saveTokenToCookie } from 'utils/saveTokenToCookie';
import { config } from 'config';
import { WorkerApi } from 'worker-api';
import { worker } from 'index';

export const useFormikCustom = (...args: any) => {
  const setIsSigningIn = args[0];
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
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { username, password } = values;

      setIsSigningIn(true);

      await WorkerApi.login({
        type: 'login',
        username,
        password,
      });

      worker.port.addEventListener('message', (message) => {
        const data = message.data;
        let res = data;

        if (data.type === 'login') {
          if (data.status === 201) {
            res = {
              status: 201,
              ...data.response,
            };
          }

          if (res.status === 201) {
            const { access_token, refresh_token } = res as {
              access_token: string;
              refresh_token: string;
            };

            const decoded: {
              email: string;
              username: string;
            } = jwt_decode(access_token);

            saveTokenToCookie(
              access_token,
              decoded.username,
              'at',
            );
            saveTokenToCookie(
              refresh_token,
              decoded.username,
              'rt',
            );

            localStorage.setItem(
              'userData',
              JSON.stringify({
                email: decoded.email,
                username: decoded.username,
              }),
            );

            setIsAuth(true);
            navigate('/');
          }

          if (res.status === 401) {
            setError(401);
            timeoutId.current = setTimeout(() => {
              setError(null);
            }, config.ALERT_DELAY);
          }

          if (res.status === 500 || res.status === 5000) {
            setError(500);
            timeoutId.current = setTimeout(() => {
              setError(null);
            }, config.ALERT_DELAY);
          }

          setIsSigningIn(false);
        }
      });
    },
  });

  return formik;
};
