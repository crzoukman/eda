import React, {
  FC,
  MutableRefObject,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Alert, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  FormStyled,
  AlertsWrapperStyled,
} from './ProfileForm.styled';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import Api from 'api';
import { config } from 'config';
import { reducer } from './reducer/reducer';
import { initialState } from './reducer/initialState';
import {
  SetAllAction,
  SetAnswerAction,
  SetFirstnameAction,
  SetLastnameAction,
  SetPatronymicAction,
  SetQuestionAction,
} from './reducer/actions';
import { AppContext } from 'App';
import { ApiResponseInterface, IAppContext } from 'types';
import { v4 as uuidv4 } from 'uuid';

const ProfileForm: FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [profileState, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const { logout } = useContext(AppContext) as IAppContext;

  const updateProfileTimeout: MutableRefObject<NodeJS.Timeout | null> =
    useRef(null);

  useEffect(() => {
    return () => {
      if (updateProfileTimeout.current) {
        clearTimeout(updateProfileTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      setIsSending(true);

      const res = await Api.getProfileData(token);

      setIsSending(false);

      if (res.status === 200) {
        dispatch(SetAllAction(res.data));
      }

      if (res.status !== 200) {
        console.log(
          '[ProfileForm.tsx] Получение данных для профайла. Невалидный токен.',
        );
        logout();
      }
    })();
  }, []);

  const formHandler = (e: React.FormEvent) => {
    e.preventDefault();

    (async () => {
      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      setIsSending(true);

      const res = await Api.updateProfile(
        profileState,
        token,
      );

      setIsSending(false);

      if (res.status === 200) {
        dispatch(SetAllAction(res.data));
        setShowSuccess(true);

        updateProfileTimeout.current = setTimeout(() => {
          setShowSuccess(false);
        }, config.ALERT_DELAY);
      } else if (res.status === 401) {
        console.log(
          '[ProfileForm.tsx] Обновление данных профайла. Невалидный токен.',
        );
        logout();
      } else {
        console.log(
          '[ProfileForm.tsx] Обновление данных. Что-то случилось. Ошибка: ',
          res.status,
        );
      }
    })();
  };

  const firstnameHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(SetFirstnameAction(e.target.value));
  };

  const lastnameHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(SetLastnameAction(e.target.value));
  };

  const patronymicHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(SetPatronymicAction(e.target.value));
  };

  const questionHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(SetQuestionAction(e.target.value));
  };

  const answerHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(SetAnswerAction(e.target.value));
  };

  return (
    <div>
      <FormStyled onSubmit={formHandler}>
        <TextField
          fullWidth
          id="fistname"
          name="firstname"
          label="First Name"
          type="text"
          value={profileState.firstname}
          onChange={firstnameHandler}
          disabled={isSending}
        />
        <TextField
          fullWidth
          id="lastname"
          name="lastname"
          label="Last Name"
          type="text"
          value={profileState.lastname}
          onChange={lastnameHandler}
          disabled={isSending}
        />
        <TextField
          fullWidth
          id="patronymic"
          name="patronymic"
          label="Patronymic"
          type="text"
          value={profileState.patronymic}
          onChange={patronymicHandler}
          disabled={isSending}
        />
        <TextField
          fullWidth
          id="question"
          name="question"
          label="Question"
          type="text"
          value={profileState.question}
          onChange={questionHandler}
          disabled={isSending}
        />
        <TextField
          fullWidth
          id="answer"
          name="answer"
          label="Answer"
          type="text"
          value={profileState.answer}
          onChange={answerHandler}
          disabled={isSending}
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
      </FormStyled>

      <AlertsWrapperStyled>
        {showSuccess && (
          <Alert severity="success">
            User has been updated!
          </Alert>
        )}
        {showError && (
          <Alert severity="error">
            Some error occured!
          </Alert>
        )}
      </AlertsWrapperStyled>
    </div>
  );
};

export default ProfileForm;
