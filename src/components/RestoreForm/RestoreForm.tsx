import {
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Alert, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormikCustom } from './hooks/useFormikCustom';
import Api from 'api';
import { RestoreFormWrapperStyled } from './RestoreForm.styled';
import { IProps } from './types';
import { config } from 'config';
import isEmail from 'validator/lib/isEmail';

const ProfileForm: FC<IProps> = ({
  setQuestion,
  question,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<null | boolean>(null);
  const [success, setSuccess] = useState<null | boolean>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(
    null,
  );

  const getQuestionTimeout = useRef<null | NodeJS.Timeout>(
    null,
  );

  useEffect(() => {
    return () => {
      if (getQuestionTimeout.current) {
        clearTimeout(getQuestionTimeout.current);
      }
    };
  }, []);

  const formik = useFormikCustom({
    setIsSending,
    setError,
    setErrorMsg,
    setSuccess,
    login,
    email,
  });

  const getQuestionHandler = async () => {
    if (isEmail(email)) {
      setIsSending(true);
      const res = await Api.getQuestion(
        login.toLowerCase(),
        email.toLowerCase(),
      );
      setIsSending(false);

      if (res.status === 200) {
        setQuestion(res.data);
      } else {
        setError(true);

        if (res.status === 403) {
          setErrorMsg(
            'Username and email must belong the same user!',
          );
        }

        if (res.status === 404) {
          setErrorMsg('Username does not exist!');
        }

        if (res.status == 410) {
          setErrorMsg('Question or answer missing!');
        }

        getQuestionTimeout.current = setTimeout(() => {
          setError(false);
          setErrorMsg(null);
        }, config.ALERT_DELAY);
      }
    }
  };

  const handleEmail = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const email = e.target.value;
    setEmail(email);
  };

  return (
    <div>
      {question && (
        <RestoreFormWrapperStyled
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            id="answer"
            name="answer"
            label="Answer"
            type="text"
            value={formik.values.answer}
            onChange={formik.handleChange}
            error={
              formik.touched.answer &&
              Boolean(formik.errors.answer)
            }
            helperText={
              formik.touched.answer && formik.errors.answer
            }
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="New password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={
              formik.touched.password &&
              Boolean(formik.errors.password)
            }
            helperText={
              formik.touched.password &&
              formik.errors.password
            }
          />

          <TextField
            fullWidth
            id="passwordConfirmation"
            name="passwordConfirmation"
            label="Password confirmation"
            type="password"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            error={
              formik.touched.passwordConfirmation &&
              Boolean(formik.errors.passwordConfirmation)
            }
            helperText={
              formik.touched.passwordConfirmation &&
              formik.errors.passwordConfirmation
            }
          />

          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            loading={isSending}
            disabled={isSending}
          >
            Update
          </LoadingButton>
        </RestoreFormWrapperStyled>
      )}

      {!question && (
        <RestoreFormWrapperStyled>
          <TextField
            id="outlined-basic"
            label="Login"
            variant="outlined"
            fullWidth
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmail}
            error={!isEmail(email)}
            helperText={
              !isEmail(email) && 'Enter valid email'
            }
          />

          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            loading={isSending}
            disabled={isSending}
            onClick={getQuestionHandler}
          >
            Send
          </LoadingButton>
        </RestoreFormWrapperStyled>
      )}

      <div style={{ marginTop: '20px' }}>
        {error && (
          <Alert severity="error">{errorMsg}</Alert>
        )}
        {success && (
          <Alert severity="success">
            Password had been restored!
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
