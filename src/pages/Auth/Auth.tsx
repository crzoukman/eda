import AuthForm from "components/AuthForm";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { AuthWrapperStyled, SpanStyled } from "./Auth.styled";

const Auth: FC = () => {
  const navigate = useNavigate();

  const signUpHandler = () => {
    navigate('/reg');
  };

  const restoreHandler = () => {
    navigate('/restore');
  };

  return (
    <AuthWrapperStyled>
      <AuthForm />
      <div>
        <div>Don't have an account? <SpanStyled onClick={signUpHandler}>Sign Up!</SpanStyled></div>
        <div>Forgot the password? <SpanStyled onClick={restoreHandler}>Restore!</SpanStyled></div>
      </div>
    </AuthWrapperStyled>
  );
};

export default Auth;