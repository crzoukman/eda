import { TasksAPI } from 'api/TasksAPI';
import { useContext, useEffect, useState } from 'react';
import { ITasks } from '../types';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { AppContext } from 'App';
import { ApiResponseInterface, IAppContext } from 'types';
import formatDate from '../utils/formatDate';
import { RequestNameList } from 'Connect';

const useCustomTasks = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<ITasks[]>([]);
  const [plannedTasks, setPlannedTasks] = useState<
    ITasks[]
  >([]);
  const [startedTasks, setStartedTasks] = useState<
    ITasks[]
  >([]);
  const [completedTasks, setCompletedTasks] = useState<
    ITasks[]
  >([]);
  const [expiredTasks, setExpiredTasks] = useState<
    ITasks[]
  >([]);
  const [update, updateState] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sorted, setSorted] = useState<ITasks[]>(tasks);
  const [getTasksCB, setGetTasksCB] =
    useState<null | ApiResponseInterface<any>>(null);

  const { logout, push2Queue } = useContext(
    AppContext,
  ) as IAppContext;

  useEffect(() => {
    const lsUserData = localStorage.getItem(
      'userData',
    ) as string;

    const getTasks = async () => {
      const username = getUsernameFromLS();
      const token = getTokenFromCookie(username, 'at');

      const res = await TasksAPI.getTasks(token);

      return res;
    };

    if (lsUserData) {
      push2Queue({
        name: RequestNameList.getTasks,
        fn: getTasks,
        cb: setGetTasksCB,
        processOnlyLast: true,
      });
    }
  }, [update]);

  useEffect(() => {
    if (getTasksCB) {
      if (getTasksCB.status === 200) {
        setTasks(getTasksCB.data);
        setSorted(getTasksCB.data);
        setGetTasksCB(null);
      }
    }
  }, [getTasksCB]);

  useEffect(() => {
    const today = new Date().getTime();
    const [y, m, d] = formatDate(new Date());

    const completed = sorted.filter(
      (task: ITasks) => task.completed,
    );
    setCompletedTasks(completed);

    const expired = sorted.filter((task: ITasks) => {
      const time = new Date(task.plannedEnd);
      const [yy, mm, dd] = formatDate(time);

      if (
        time.getTime() < today &&
        (y !== yy || d !== dd || m !== mm) &&
        !task.completed &&
        !task.started
      ) {
        return task;
      }
    });
    setExpiredTasks(expired);

    const planned = sorted.filter((task: ITasks) => {
      const time = new Date(task.plannedEnd);
      const [yy, mm, dd] = formatDate(time);

      if (
        !(
          time.getTime() < today &&
          (y !== yy || d !== dd || m !== mm)
        ) &&
        !task.completed &&
        !task.started
      ) {
        return task;
      }
    });
    setPlannedTasks(planned);

    const started = sorted.filter(
      (task: ITasks) => task.started,
    );
    setStartedTasks(started);
  }, [tasks, sorted]);

  return [
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
  ];
};

export default useCustomTasks;
