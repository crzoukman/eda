import { FC, useState } from 'react';
import {
  Alert,
  AlertTitle,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormikCustom } from './hooks/useFormikCustom';
import { RegFormWrapperStyled } from './RegForm.styled';

const RegForm: FC = () => {
  const [isCreatingUser, setIsCreatingUser] =
    useState(false);
  const [error, setError] = useState<number | null>(null);
  const formik = useFormikCustom(
    setIsCreatingUser,
    setError,
  );

  return (
    <RegFormWrapperStyled onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="username"
        name="username"
        label="Username"
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
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={
          formik.touched.email &&
          Boolean(formik.errors.email)
        }
        helperText={
          formik.touched.email && formik.errors.email
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
      <TextField
        fullWidth
        id="changepassword"
        name="changepassword"
        label="Confirm the password"
        type="password"
        value={formik.values.changepassword}
        onChange={formik.handleChange}
        error={
          formik.touched.changepassword &&
          Boolean(formik.errors.changepassword)
        }
        helperText={
          formik.touched.changepassword &&
          formik.errors.changepassword
        }
      />
      <LoadingButton
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        loading={isCreatingUser}
        disabled={isCreatingUser}
      >
        Create A New Account
      </LoadingButton>

      {error === 500 && (
        <Alert severity="error" sx={{ mt: '20px' }}>
          <AlertTitle>Error</AlertTitle>
          Can not register a new user ???{' '}
          <strong>try later!</strong>
        </Alert>
      )}

      {error === 409 && (
        <Alert severity="warning" sx={{ mt: '20px' }}>
          <AlertTitle>Warning</AlertTitle>
          Username or email already exists ???{' '}
          <strong>try harder!</strong>
        </Alert>
      )}
    </RegFormWrapperStyled>
  );
};

export default RegForm;
