import { FC, useState } from "react";
import { Alert, TextField } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useFormikCustom } from "./hooks/useFormikCustom";
import Api from "api";
import { RestoreFormWrapperStyled } from "./RestoreForm.styled";
import { IProps } from "./types";

const ProfileForm: FC<IProps> = ({ setQuestion, question }) => {
  const [isSending, setIsSending] = useState(false);
  const [login, setLogin] = useState('');
  const [error, setError] = useState<null | boolean>(null);

  const formik = useFormikCustom(setIsSending, setQuestion, login, setError);

  const getLoginHandler = async () => {
    setIsSending(true);
    const res = await Api.getQuestion(login.toLowerCase());
    setIsSending(false);
    if (res && res.data !== null) {
      setQuestion(res.data);
    } else {

    }
  };

  return (
    <div>
      {question && (
        <RestoreFormWrapperStyled onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="answer"
            name="answer"
            label="Answer"
            type="text"
            value={formik.values.answer}
            onChange={formik.handleChange}
            error={formik.touched.answer && Boolean(formik.errors.answer)}
            helperText={formik.touched.answer && formik.errors.answer}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="New password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth type="submit"
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

          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            loading={isSending}
            disabled={isSending}
            onClick={getLoginHandler}
          >
            Send
          </LoadingButton>
        </RestoreFormWrapperStyled>
      )}

      <div style={{ marginTop: '20px' }}>
        {error && (
          <Alert severity="error">Answers don't match!</Alert>
        )}
        {error === false && (
          <Alert severity="success">Password had been restored!</Alert>
        )}
      </div>

    </div>
  );
};

export default ProfileForm;