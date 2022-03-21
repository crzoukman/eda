import RegForm from "components/RegForm";
import { FC } from "react";
import { RegWrapperStyled } from "./Reg.styled";

const Reg: FC = () => {
  return (
    <RegWrapperStyled>
      <RegForm />
    </RegWrapperStyled>
  );
};

export default Reg;