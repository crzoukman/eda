import { FC, useContext } from 'react';
import { Alert, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskModal from 'components/TaskModal';
import { ITasks } from './types';
import {
  ButtonsWrapperStyled,
  TaskHeaderStyled,
  TasksWrapperStyled,
  TaskWrapperStyled,
} from './Tasks.styled';
import Task from 'components/Task';
import FilterListIcon from '@mui/icons-material/FilterList';
import FiltersModal from 'components/FiltersModal';
import useCustomTasks from './hooks/useCustomTasks';
import { AppContext } from 'App';
import { IAppContext } from 'types';
import Bars from 'components/Bars';

const Tasks: FC = () => {
  const { isAuth } = useContext(AppContext) as IAppContext;

  const [
    setOpen,
    setShowFilters,
    startedTasks,
    plannedTasks,
    completedTasks,
    expiredTasks,
    updateState,
    tasks,
    showFilters,
    open,
    setSorted,
  ] = useCustomTasks() as any;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openFilters = () => setShowFilters(true);
  const closeFilters = () => setShowFilters(false);

  if (isAuth) {
    return (
      <div>
        {/* <Bars tasks={tasks} /> */}
        <ButtonsWrapperStyled>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add New Task
          </Button>

          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={openFilters}
          >
            Filters
          </Button>
        </ButtonsWrapperStyled>

        <TaskHeaderStyled>
          <div>Name</div>
          <div>Added</div>
          <div>Type</div>
          <div>Planned Start</div>
          <div>Planned End</div>
          <div>Started</div>
          <div>Ended</div>
          <div></div>
        </TaskHeaderStyled>

        <TasksWrapperStyled>
          <div>
            {startedTasks.length > 0 && (
              <Divider>In Progress</Divider>
            )}
            <TaskWrapperStyled>
              {startedTasks.map((task: ITasks) => (
                <Task
                  {...task}
                  expired={false}
                  updateState={updateState}
                  key={task.id}
                />
              ))}
            </TaskWrapperStyled>
          </div>

          <div>
            {plannedTasks.length > 0 && (
              <Divider>Planned</Divider>
            )}
            <TaskWrapperStyled>
              {plannedTasks.map((task: ITasks) => (
                <Task
                  {...task}
                  expired={false}
                  updateState={updateState}
                  key={task.id}
                />
              ))}
            </TaskWrapperStyled>
          </div>

          <div>
            {completedTasks.length > 0 && (
              <Divider>Completed</Divider>
            )}
            <TaskWrapperStyled>
              {completedTasks.map((task: ITasks) => (
                <Task
                  {...task}
                  expired={false}
                  updateState={updateState}
                  key={task.id}
                />
              ))}
            </TaskWrapperStyled>
          </div>

          <div>
            {expiredTasks.length > 0 && (
              <Divider>Expired</Divider>
            )}
            <TaskWrapperStyled>
              {expiredTasks.map((task: ITasks) => (
                <Task
                  {...task}
                  expired={true}
                  updateState={updateState}
                  key={task.id}
                />
              ))}
            </TaskWrapperStyled>
          </div>
        </TasksWrapperStyled>

        <TaskModal
          handleClose={handleClose}
          updateState={updateState}
          open={open}
        />

        <FiltersModal
          closeFilters={closeFilters}
          showFilters={showFilters}
          tasks={tasks}
          setSorted={setSorted}
        />
      </div>
    );
  } else {
    return (
      <Alert severity="info">
        You have to login to work with tasks!
      </Alert>
    );
  }
};

export default Tasks;
