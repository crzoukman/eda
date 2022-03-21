import { FC, useState } from "react";
import { Alert, TextField } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useFormikCustom } from "./hooks/useFormikCustom";
import { FormStyled, AlertsWrapperStyled } from "./ProfileForm.styled";

const ProfileForm: FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const formik = useFormikCustom(setIsSending, setShowSuccess, setShowError);

  return (
    <div>
      <FormStyled onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="fistname"
          name="firstname"
          label="First Name"
          type="text"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          error={formik.touched.firstname && Boolean(formik.errors.firstname)}
          helperText={formik.touched.firstname && formik.errors.firstname}
        />
        <TextField
          fullWidth
          id="lastname"
          name="lastname"
          label="Last Name"
          type="text"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          error={formik.touched.lastname && Boolean(formik.errors.lastname)}
          helperText={formik.touched.lastname && formik.errors.lastname}
        />
        <TextField
          fullWidth
          id="patronymic"
          name="patronymic"
          label="Patronymic"
          type="text"
          value={formik.values.patronymic}
          onChange={formik.handleChange}
          error={formik.touched.patronymic && Boolean(formik.errors.patronymic)}
          helperText={formik.touched.patronymic && formik.errors.patronymic}
        />
        <TextField
          fullWidth
          id="question"
          name="question"
          label="Question"
          type="text"
          value={formik.values.question}
          onChange={formik.handleChange}
          error={formik.touched.question && Boolean(formik.errors.question)}
          helperText={formik.touched.question && formik.errors.question}
        />
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
        <LoadingButton
          color="primary"
          variant="contained"
          fullWidth type="submit"
          loading={isSending}
          disabled={isSending}
        >
          Update
        </LoadingButton>
      </FormStyled>

      <AlertsWrapperStyled>
        {showSuccess && <Alert severity="success">User has been updated!</Alert>}
        {showError && <Alert severity="error">Some error occured!</Alert>}
      </AlertsWrapperStyled>

    </div>
  );
};

export default ProfileForm;