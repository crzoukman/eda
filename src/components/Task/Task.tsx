import { FC, useState } from "react";
import { IconsWrapperStyled, WrapperStyled } from "./Task.styled";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TasksAPI } from "api/TasksAPI";
import EditModal from "components/EditModal";
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const iconStyles = {
  cursor: 'pointer',
  transition: '0.25s !important',
  padding: '6px',

  '&:hover': {
    background: 'whitesmoke',
    borderRadius: '4px',
  }
}

const Task: FC<any> = (props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<null | boolean>(null);
  const [isBusy, setIsBusy] = useState(false);

  const plannedStart = new Date(props.plannedStart).toISOString().slice(0, 10).split('-').reverse().join('-');
  const plannedEnd = new Date(props.plannedEnd).toISOString().slice(0, 10).split('-').reverse().join('-');
  const startedTime = props.startedTime && new Date(props.startedTime).toISOString().slice(0, 10).split('-').reverse().join('-');
  const startedEnd = props.endedTime && new Date(props.endedTime).toISOString().slice(0, 10).split('-').reverse().join('-');
  const added = new Date(props.date).toISOString().slice(0, 10).split('-').reverse().join('-');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStart = async () => {
    if (!isBusy) {
      const date = new Date();
      setIsBusy(true);
      const res = await TasksAPI.editTask({
        _id: props._id,
        started: true,
        completed: false,
        startedTime: date,
      });

      setIsBusy(false);

      // if (res?.status === 200) {
      //   setError(false);
      // } else {
      //   setError(true);
      // }

      // setTimeout(() => {
      //   setError(null);
      // }, 3000);

      props.updateState({});
    }
  };

  const handleCompleted = async () => {
    if (!isBusy) {
      const date = new Date();
      setIsBusy(true);
      const res = await TasksAPI.editTask({
        _id: props._id,
        completed: true,
        started: false,
        endedTime: date,
      });

      setIsBusy(false);

      // if (res?.status === 200) {
      //   setError(false);
      // } else {
      //   setError(true);
      // }

      // setTimeout(() => {
      //   setError(null);
      // }, 3000);

      props.updateState({});
    }
  };

  const handleDelete = async () => {
    if (!isBusy) {
      setIsBusy(true);
      const res = await TasksAPI.deleteTask(props._id);
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
        {!props.started && !props.completed && !props.expired && (
          <PlayArrowIcon
            onClick={handleStart}
            fontSize='large'
            sx={{
              color: isBusy ? 'gray' : 'DeepPink',
              ...iconStyles
            }}
          />
        )}
        {!props.completed && props.started && (
          <CheckIcon
            onClick={handleCompleted}
            fontSize='large'
            sx={{
              color: isBusy ? 'gray' : 'green',
              ...iconStyles
            }}
          />
        )}
        {!props.completed && !props.expired && (
          <EditIcon
            onClick={handleEdit}
            fontSize='large'
            sx={{
              color: 'blue',
              ...iconStyles
            }}
          />
        )}
        <DeleteIcon
          onClick={handleDelete}
          fontSize='large'
          sx={{
            color: isBusy ? 'gray' : 'red',
            ...iconStyles
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