import {
  DesktopDatePicker,
  LoadingButton,
  LocalizationProvider,
} from '@mui/lab';
import {
  Alert,
  Box,
  MenuItem,
  Modal,
  Stack,
  TextField,
} from '@mui/material';
import { TasksAPI } from 'api/TasksAPI';
import React, {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { style, typesConfig } from './config';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { config } from 'config';
import { AppContext } from 'App';
import { ApiResponseInterface, IAppContext } from 'types';
import { RequestNameList } from 'Connect';

const today = new Date();

const EditModal: FC<any> = (props) => {
  const [task, setTask] = useState(props.name);
  const [error, setError] = useState<null | boolean>(null);
  const [success, setSuccess] = useState<null | boolean>(
    null,
  );
  const [plannedStart, setPlannedStart] =
    useState<Date | null>(new Date(props.plannedStart));
  const [plannedEnd, setPlannedEnd] = useState<Date | null>(
    new Date(props.plannedEnd),
  );
  const [type, setType] = useState<string>(props.type);
  const [editTaskCB, setEditTaskCB] =
    useState<null | ApiResponseInterface<any>>(null);

  const { push2Queue, lock } = useContext(
    AppContext,
  ) as IAppContext;

  const timeError = useRef<boolean>(false);
  const timeoutId = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editTaskCB) {
      props.updateState({});
      setEditTaskCB(null);
    }
  }, [editTaskCB]);

  const handlePlannedStart = (newValue: Date | null) => {
    setPlannedStart(newValue);
  };

  const handlePlannedEnd = (newValue: Date | null) => {
    setPlannedEnd(newValue);
  };

  const typeHandler = (type: string) => setType(type);

  const editTaskHandler = async () => {
    const added = new Date();

    if (
      plannedStart &&
      plannedEnd &&
      plannedEnd.getTime() < plannedStart.getTime()
    ) {
      setError(true);
      timeError.current = true;

      timeoutId.current = setTimeout(() => {
        setError(null);
        timeError.current = false;
      }, config.ALERT_DELAY);
    }

    const editTask = async () => {
      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      const res = await TasksAPI.editTask(
        {
          id: props.id,
          name: task,
          added,
          type,
          plannedStart,
          plannedEnd,
        },
        token,
      );

      return res;
    };

    if (!lock) {
      if (task.length && !timeError.current) {
        push2Queue({
          name: RequestNameList.editTask,
          fn: editTask,
          cb: setEditTaskCB,
          processOnlyLast: false,
          identifier: RequestNameList.editTask + props.id,
        });
      }
    }
  };

  const taskHandler = (name: string) => {
    setTask(name);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TextField
          fullWidth
          label="Task Name"
          id="fullWidth"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
          ) => taskHandler(e.target.value)}
          value={task}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          id="outlined-select-types"
          select
          label="Types"
          value={type}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
          ) => typeHandler(e.target.value)}
          sx={{ mb: 2 }}
        >
          {typesConfig.map(
            (option: { value: string; label: string }) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ),
          )}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3} sx={{ mb: 2 }}>
            <DesktopDatePicker
              label="Planned Start Time"
              inputFormat="dd/MM/yyyy"
              value={plannedStart}
              onChange={(e: Date | null) =>
                handlePlannedStart(e)
              }
              renderInput={(params) => (
                <TextField {...params} />
              )}
              minDate={today}
            />
            <DesktopDatePicker
              label="Planned End Time"
              inputFormat="dd/MM/yyyy"
              value={plannedEnd}
              onChange={(e: Date | null) =>
                handlePlannedEnd(e)
              }
              renderInput={(params) => (
                <TextField {...params} />
              )}
              minDate={plannedStart ? plannedStart : today}
            />
          </Stack>
          <LoadingButton
            variant="contained"
            onClick={editTaskHandler}
            disabled={lock}
          >
            Submit
          </LoadingButton>
        </LocalizationProvider>
        <div style={{ marginTop: '20px' }}>
          {error && (
            <Alert severity="error">
              Error: Couldn't edit the task!
            </Alert>
          )}
          {success && (
            <Alert severity="success">
              Success: The task has been edited!
            </Alert>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default EditModal;
