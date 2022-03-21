import Api from "api";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "../utils/validationSchema";

export const useFormikCustom = (...args: any) => {
  const setIsSending = args[0];
  const setQuestion = args[1];
  const login = args[2];
  const setError = args[3];

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: '',
      answer: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { answer, password } = values;
      setIsSending(true);

      try {
        const res = await Api.getRestoreData({
          username: login,
          answer,
          password,
        });

        setIsSending(false);

        if (res) {
          setError(false);
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
        } else {
          setError(true);
        }
        setTimeout(() => {
          setError(null);
        }, 3000);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
      }
    },
  });

  return formik;
}; 