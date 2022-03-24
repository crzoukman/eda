import { FC, useState } from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useFormikCustom } from "./hooks/useFormikCustom";
import { AuthFormWrapperStyled } from "./AuthForm.styled";

const AuthForm: FC = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const formik = useFormikCustom(setIsSigningIn);

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
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
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
        loading={isSigningIn}
        disabled={isSigningIn}
      >
        Log In
      </LoadingButton>
    </AuthFormWrapperStyled>
  );
};

export default AuthForm;