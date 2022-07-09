import { FC, useContext, useEffect, useState } from 'react';
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
import { ApiResponseInterface, IAppContext } from 'types';
import { RequestNameList } from 'Connect';
import { WorkerApi } from 'worker-api';
import { worker } from 'index';

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
  const [startTaskCB, setStartTaskCB] =
    useState<null | ApiResponseInterface<any>>(null);
  const [completeTaskCB, setCompleteTaskCB] =
    useState<null | ApiResponseInterface<any>>(null);
  const [deleteTaskCB, setDeleteTaskCB] =
    useState<null | ApiResponseInterface<any>>(null);

  const { logout, push2Queue, lock } = useContext(
    AppContext,
  ) as IAppContext;

  const plannedStart = formatDate(props.plannedStart);
  const plannedEnd = formatDate(props.plannedEnd);
  const startedTime =
    props.startedTime && formatDate(props.startedTime);
  const startedEnd =
    props.endedTime && formatDate(props.endedTime);
  const added = formatDate(props.added);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (startTaskCB) {
      setIsBusy(false);
      props.updateState({});
      setStartTaskCB(null);
    }

    if (completeTaskCB) {
      setIsBusy(false);
      props.updateState({});
      setCompleteTaskCB(null);
    }

    if (deleteTaskCB) {
      setIsBusy(false);
      props.updateState({});
      setDeleteTaskCB(null);
    }
  }, [startTaskCB, completeTaskCB, deleteTaskCB]);

  const handleStart = () => {
    if (!isBusy && !lock) {
      const startTask = () => {
        const date = new Date();
        setIsBusy(true);

        const username = getUsernameFromLS();
        const token = getTokenFromCookie(username, 'at');

        WorkerApi.editTask(
          {
            id: props.id,
            started: true,
            completed: false,
            startedTime: date,
          },
          token,
        );
      };

      startTask();

      if (!lock) {
        worker.port.addEventListener(
          'message',
          (message) => {
            if (message.data.type === 'editTask') {
              setStartTaskCB({ status: 200 });
            }
          },
        );
      } else {
        console.log(
          '[Task.tsx] lock = true. Не могу пушнуть startTask',
        );
      }
    }
  };

  const handleCompleted = () => {
    if (!isBusy && !lock) {
      const completeTask = () => {
        const date = new Date();
        setIsBusy(true);

        const username = getUsernameFromLS();
        const token = getTokenFromCookie(username, 'at');

        WorkerApi.editTask(
          {
            id: props.id,
            completed: true,
            started: false,
            endedTime: date,
          },
          token,
        );
      };

      completeTask();

      if (!lock) {
        worker.port.addEventListener(
          'message',
          (message) => {
            if (message.data.type === 'editTask') {
              setCompleteTaskCB({ status: 200 });
            }
          },
        );
      } else {
        console.log(
          '[Task.tsx] lock = true. Не могу пушнуть comleteTask',
        );
      }
    }
  };

  const handleDelete = () => {
    const deleteTask = () => {
      if (!isBusy && !lock) {
        setIsBusy(true);

        const username = getUsernameFromLS();
        const token = getTokenFromCookie(username, 'at');

        WorkerApi.deleteTask(props.id, token);
      }
    };

    deleteTask();

    if (!lock) {
      worker.port.addEventListener('message', (message) => {
        if (message.data.type === 'deleteTask') {
          setDeleteTaskCB({ status: 200 });
        }
      });
    } else {
      console.log(
        '[Task.tsx] lock = true. Не могу пушнуть deleteTask',
      );
    }
  };

  const handleEdit = () => {
    if (!isBusy && !lock) {
      handleOpen();
    }
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
                color: isBusy || lock ? 'gray' : 'DeepPink',
                ...iconStyles,
              }}
            />
          )}
        {!props.completed && props.started && (
          <CheckIcon
            onClick={handleCompleted}
            fontSize="large"
            sx={{
              color: isBusy || lock ? 'gray' : 'green',
              ...iconStyles,
            }}
          />
        )}
        {!props.completed && !props.expired && (
          <EditIcon
            onClick={handleEdit}
            fontSize="large"
            sx={{
              color: isBusy || lock ? 'gray' : 'blue',
              ...iconStyles,
            }}
          />
        )}
        <DeleteIcon
          onClick={handleDelete}
          fontSize="large"
          sx={{
            color: isBusy || lock ? 'gray' : 'red',
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
