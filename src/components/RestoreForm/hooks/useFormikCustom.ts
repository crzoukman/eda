import Api from 'api';
import { config } from 'config';
import { useFormik } from 'formik';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { validationSchema } from '../utils/validationSchema';

interface PropsInterface {
  setIsSending: (arg: boolean) => void;
  setError: (arg: boolean | null) => void;
  setErrorMsg: (arg: string | null) => void;
  setSuccess: (arg: boolean | null) => void;
  login: string;
  email: string;
}

export const useFormikCustom = ({
  setIsSending,
  setError,
  setErrorMsg,
  setSuccess,
  login,
  email,
}: PropsInterface) => {
  const navigate = useNavigate();

  const timeout = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: '',
      answer: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { answer, password } = values;

      setIsSending(true);
      const res = await Api.restorePassword({
        username: login,
        email,
        answer,
        password,
      });

      setIsSending(false);

      if (res.status === 200) {
        setSuccess(true);

        timeout.current = setTimeout(() => {
          setSuccess(null);
          navigate('/auth');
        }, config.ALERT_DELAY);
      } else {
        setError(true);
        setErrorMsg(res.message);

        timeout.current = setTimeout(() => {
          setError(null);
        }, config.ALERT_DELAY);
      }
    },
  });

  return formik;
};
