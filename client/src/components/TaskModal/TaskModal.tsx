import { DesktopDatePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import { Alert, Box, InputLabel, MenuItem, Modal, Select, Stack, TextField } from "@mui/material";
import { TasksAPI } from "api/TasksAPI";
import React, { FC, useState } from "react";
import { IProps } from './types';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { style, typesConfig } from "./config";

const today = new Date();

const TaskModal: FC<IProps> = ({ handleClose, open, updateState }) => {
  const [task, setTask] = useState('');
  const [error, setError] = useState<null | boolean>(null);
  const [plannedStart, setPlannedStart] = React.useState<Date | null>(today);
  const [plannedEnd, setPlannedEnd] = React.useState<Date | null>(today);
  const [type, setType] = useState<string>('Type 1');

  const handlePlannedStart = (newValue: Date | null) => {
    setPlannedStart(newValue);
  };

  const handlePlannedEnd = (newValue: Date | null) => {
    setPlannedEnd(newValue);
  };

  const typeHandler = (type: string) => setType(type);

  const addTaskHandler = async () => {
    const date = new Date();
    const id = JSON.parse(localStorage.getItem('userData') as string)._id;

    if (plannedStart && plannedEnd && plannedEnd.getTime() < plannedStart.getTime()) {
      setError(true);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }

    if (task.length) {
      const res = await TasksAPI.addTask({
        userId: id,
        name: task,
        date,
        type,
        plannedStart,
        plannedEnd,
        completed: false,
        started: false,
      });

      if (res?.status === 200) {
        setError(false);
      } else {
        setError(true);
      }

      setTimeout(() => {
        setError(null);
      }, 3000);
    }

    updateState({});
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => taskHandler(e.target.value)}
          value={task}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          id="outlined-select-types"
          select
          label="Types"
          value={type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => typeHandler(e.target.value)}
          sx={{ mb: 2 }}
        >
          {typesConfig.map((option: { value: string, label: string }) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3} sx={{ mb: 2 }}>
            <DesktopDatePicker
              label="Planned Start Time"
              inputFormat="dd/MM/yyyy"
              value={plannedStart}
              onChange={(e: Date | null) => handlePlannedStart(e)}
              renderInput={(params) => <TextField {...params} />}
              minDate={today}
            />
            <DesktopDatePicker
              label="Planned End Time"
              inputFormat="dd/MM/yyyy"
              value={plannedEnd}
              onChange={(e: Date | null) => handlePlannedEnd(e)}
              renderInput={(params) => <TextField {...params} />}
              minDate={plannedStart ? plannedStart : today}
            />

          </Stack>
          <LoadingButton
            variant="contained"
            onClick={addTaskHandler}
          >
            Add
          </LoadingButton>
        </LocalizationProvider>
        <div>
          {error && <Alert severity="error">Error: Couldn't add the task!</Alert>}
          {error === false && <Alert severity="success">Success: The task has been added!</Alert>}
        </div>
      </Box>

    </Modal>
  );
};

export default TaskModal;