import RestoreForm from "components/RestoreForm";
import { FC, useState } from "react";
import { RestoreWrapperStyled } from "./Restore.styled";

const Restore: FC = () => {
  const [question, setQuestion] = useState<null | string>(null);

  return (
    <RestoreWrapperStyled>
      <div>
        <h4>
          {!question
            ? 'Enter the login'
            : 'Enter the answer to the question and a new password'
          }
        </h4>
        <h3>{question && question}</h3>
      </div>
      <RestoreForm
        setQuestion={setQuestion}
        question={question}
      />
    </RestoreWrapperStyled>
  );
};

export default Restore;