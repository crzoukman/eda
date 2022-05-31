import { FC, useState } from 'react';
import {
  Alert,
  AlertTitle,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormikCustom } from './hooks/useFormikCustom';
import { AuthFormWrapperStyled } from './AuthForm.styled';

const AuthForm: FC = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<null | number>(null);
  const formik = useFormikCustom(setIsSigningIn, setError);

  return (
    <AuthFormWrapperStyled onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="username"
        name="username"
        label="Username"
        type="text"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={
          formik.touched.username &&
          Boolean(formik.errors.username)
        }
        helperText={
          formik.touched.username && formik.errors.username
        }
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={
          formik.touched.password &&
          Boolean(formik.errors.password)
        }
        helperText={
          formik.touched.password && formik.errors.password
        }
      />
      <LoadingButton
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        loading={isSigningIn}
        disabled={isSigningIn}
      >
        Log In
      </LoadingButton>

      {error === 500 && (
        <Alert severity="error" sx={{ mt: '20px' }}>
          <AlertTitle>Error</AlertTitle>
          Can not login right now —{' '}
          <strong>try later!</strong>
        </Alert>
      )}

      {error === 401 && (
        <Alert severity="warning" sx={{ mt: '20px' }}>
          <AlertTitle>Warning</AlertTitle>
          Wrong username or password —{' '}
          <strong>try something new!</strong>
        </Alert>
      )}
    </AuthFormWrapperStyled>
  );
};

export default AuthForm;
