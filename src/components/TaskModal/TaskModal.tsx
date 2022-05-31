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
import {
  FC,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { IProps } from './types';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { style, typesConfig } from './config';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { AppContext } from 'App';
import { ApiResponseInterface, IAppContext } from 'types';
import { RequestNameList } from 'Connect';

const today = new Date();

const TaskModal: FC<IProps> = ({
  handleClose,
  open,
  updateState,
}) => {
  const [task, setTask] = useState('');
  const [error, setError] = useState<null | boolean>(null);
  const [success, setSuccess] = useState<null | boolean>(
    null,
  );
  const [plannedStart, setPlannedStart] =
    useState<Date | null>(today);
  const [plannedEnd, setPlannedEnd] = useState<Date | null>(
    today,
  );
  const [type, setType] = useState<string>('Type 1');
  const [addTaskCB, setAddTaskCB] =
    useState<null | ApiResponseInterface<any>>(null);

  const { logout, push2Queue, lock } = useContext(
    AppContext,
  ) as IAppContext;

  const timeoutId = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (addTaskCB) {
      setAddTaskCB(null);
      updateState({});
    }
  }, [addTaskCB]);

  const handlePlannedStart = (newValue: Date | null) => {
    setPlannedStart(newValue);
  };

  const handlePlannedEnd = (newValue: Date | null) => {
    setPlannedEnd(newValue);
  };

  const typeHandler = (type: string) => setType(type);

  const addTaskHandler = async () => {
    const addTask = async () => {
      const added = new Date();
      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      const res = await TasksAPI.addTask(
        {
          name: task,
          type,
          plannedStart,
          plannedEnd,
          added,
        },
        token,
      );

      return res;
    };

    if (task.length && !lock) {
      push2Queue({
        name: RequestNameList.addTask,
        fn: addTask,
        cb: setAddTaskCB,
        processOnlyLast: false,
        identifier: task,
      });
    }
  };

  const taskHandler = (name: string) => {
    setTask(name);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            onClick={addTaskHandler}
            sx={{ mb: 2 }}
            disabled={lock}
          >
            Add
          </LoadingButton>
        </LocalizationProvider>
        <div>
          {error && (
            <Alert severity="error">
              Error: Couldn't add the task!
            </Alert>
          )}
          {success && (
            <Alert severity="success">
              Success: The task has been added!
            </Alert>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default TaskModal;
