import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, FormControlLabel, FormGroup, MenuItem, Modal, Switch, TextField } from "@mui/material";
import { FC } from "react";
import { clearDateBtnStyles, styles, typesConfig } from "./config";
import { IProps } from "./types";
import BackspaceIcon from '@mui/icons-material/Backspace';
import useFilters from "./hooks/useFilters";
import { DatePickerWrapperStyled } from "./FiltersModal.styled";

const FiltersModal: FC<IProps> = ({ showFilters, closeFilters, tasks, setSorted }) => {
  const [
    plannedStart,
    setPlannedStart,
    plannedEnd,
    setPlannedEnd,
    started,
    setStarted,
    ended,
    setEnded,
    taskName,
    setTaskName,
    type,
    setType,
    completed,
    setCompleted,
  ] = useFilters({ tasks, setSorted }) as any;

  const clearPlannedStart = () => setPlannedStart(null);
  const clearPlannedEnd = () => setPlannedEnd(null);
  const clearStarted = () => setStarted(null);
  const clearEnded = () => setEnded(null);

  const handlePlannedStart = (newValue: Date | null) => {
    setPlannedStart(newValue);
  };
  const handlePlannedEnd = (newValue: Date | null) => {
    setPlannedEnd(newValue);
  };
  const handleStarted = (newValue: Date | null) => {
    setStarted(newValue);
  };
  const handleEnded = (newValue: Date | null) => {
    setEnded(newValue);
  };

  return (
    <Modal
      open={showFilters}
      onClose={closeFilters}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles}>
        <TextField
          fullWidth
          label="Task Name"
          id="taskname" value={taskName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          id="outlined-select-types"
          select
          label="Types"
          value={type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
          sx={{ mb: 2 }}
        >
          {typesConfig.map((option: { value: string, label: string }) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePickerWrapperStyled>
            <div>
              <DesktopDatePicker
                label="Planned Start Time"
                inputFormat="dd/MM/yyyy"
                value={plannedStart}
                onChange={(e: Date | null) => handlePlannedStart(e)}
                renderInput={(params) => <TextField {...params} />}
              />

              {plannedStart && (
                <BackspaceIcon
                  onClick={clearPlannedStart}
                  sx={clearDateBtnStyles}
                />
              )}
            </div>

            <div>
              <DesktopDatePicker
                label="Planned End Time"
                inputFormat="dd/MM/yyyy"
                value={plannedEnd}
                onChange={(e: Date | null) => handlePlannedEnd(e)}
                renderInput={(params) => <TextField {...params} />}
              />

              {plannedEnd && (
                <BackspaceIcon
                  onClick={clearPlannedEnd}
                  sx={clearDateBtnStyles}
                />
              )}
            </div>

            <div>
              <DesktopDatePicker
                label="Started Time"
                inputFormat="dd/MM/yyyy"
                value={started}
                onChange={(e: Date | null) => handleStarted(e)}
                renderInput={(params) => <TextField {...params} />}
              />

              {started && (
                <BackspaceIcon
                  onClick={clearStarted}
                  sx={clearDateBtnStyles}
                />
              )}
            </div>

            <div>
              <DesktopDatePicker
                label="Ended Time"
                inputFormat="dd/MM/yyyy"
                value={ended}
                onChange={(e: Date | null) => handleEnded(e)}
                renderInput={(params) => <TextField {...params} />}
              />

              {ended && (
                <BackspaceIcon
                  onClick={clearEnded}
                  sx={clearDateBtnStyles}
                />
              )}
            </div>
          </DatePickerWrapperStyled>

        </LocalizationProvider>

        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch
              checked={completed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompleted(e.target.checked)}
            />}
            label="Completed"
          />
        </FormGroup>
      </Box>
    </Modal>
  );
};

export default FiltersModal;