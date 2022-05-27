import { FC, useContext, useState } from 'react';
import {
  IconsWrapperStyled,
  WrapperStyled,
} from './Task.styled';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TasksAPI } from 'api/TasksAPI';
import EditModal from 'components/EditModal';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import formatDate from './utils/formatDate';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { AppContext } from 'App';
import { IAppContext } from 'types';

const iconStyles = {
  cursor: 'pointer',
  transition: '0.25s !important',
  padding: '6px',

  '&:hover': {
    background: 'whitesmoke',
    borderRadius: '4px',
  },
};

const Task: FC<any> = (props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<null | boolean>(null);
  const [isBusy, setIsBusy] = useState(false);

  const { logout } = useContext(AppContext) as IAppContext;

  const plannedStart = formatDate(props.plannedStart);
  const plannedEnd = formatDate(props.plannedEnd);
  const startedTime =
    props.startedTime && formatDate(props.startedTime);
  const startedEnd =
    props.endedTime && formatDate(props.endedTime);
  const added = formatDate(props.added);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStart = async () => {
    if (!isBusy) {
      const date = new Date();
      setIsBusy(true);

      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      const res = await TasksAPI.editTask(
        {
          id: props.id,
          started: true,
          completed: false,
          startedTime: date,
        },
        token,
      );

      if (res.status === 403) {
        logout();
      }

      setIsBusy(false);

      props.updateState({});
    }
  };

  const handleCompleted = async () => {
    if (!isBusy) {
      const date = new Date();
      setIsBusy(true);

      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      const res = await TasksAPI.editTask(
        {
          id: props.id,
          completed: true,
          started: false,
          endedTime: date,
        },
        token,
      );

      if (res.status === 403) {
        logout();
      }

      setIsBusy(false);

      props.updateState({});
    }
  };

  const handleDelete = async () => {
    if (!isBusy) {
      setIsBusy(true);

      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      const res = await TasksAPI.deleteTask(
        props.id,
        token,
      );

      if (res.status === 403) {
        logout();
      }

      setIsBusy(false);
      props.updateState({});
    }
  };

  const handleEdit = () => {
    handleOpen();
  };

  return (
    <WrapperStyled>
      <div>{props.name}</div>
      <div>{added}</div>
      <div>{props.type}</div>
      <div>{plannedStart}</div>
      <div>{plannedEnd}</div>
      <div>{startedTime ? startedTime : '-'}</div>
      <div>{startedEnd ? startedEnd : '-'}</div>
      <IconsWrapperStyled>
        {!props.started &&
          !props.completed &&
          !props.expired && (
            <PlayArrowIcon
              onClick={handleStart}
              fontSize="large"
              sx={{
                color: isBusy ? 'gray' : 'DeepPink',
                ...iconStyles,
              }}
            />
          )}
        {!props.completed && props.started && (
          <CheckIcon
            onClick={handleCompleted}
            fontSize="large"
            sx={{
              color: isBusy ? 'gray' : 'green',
              ...iconStyles,
            }}
          />
        )}
        {!props.completed && !props.expired && (
          <EditIcon
            onClick={handleEdit}
            fontSize="large"
            sx={{
              color: 'blue',
              ...iconStyles,
            }}
          />
        )}
        <DeleteIcon
          onClick={handleDelete}
          fontSize="large"
          sx={{
            color: isBusy ? 'gray' : 'red',
            ...iconStyles,
          }}
        />
      </IconsWrapperStyled>

      <EditModal
        {...props}
        handleClose={handleClose}
        updateState={props.updateState}
        open={open}
      />
    </WrapperStyled>
  );
};

export default Task;
