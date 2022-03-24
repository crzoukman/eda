import { TasksAPI } from "api/TasksAPI";
import { useEffect, useState } from "react";
import { ITasks } from "../types";

const useCustomTasks = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<ITasks[]>([]);
  const [plannedTasks, setPlannedTasks] = useState<ITasks[]>([]);
  const [startedTasks, setStartedTasks] = useState<ITasks[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITasks[]>([]);
  const [expiredTasks, setExpiredTasks] = useState<ITasks[]>([]);
  const [update, updateState] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sorted, setSorted] = useState<ITasks[]>(tasks);


  useEffect(() => {
    const lsUserData = localStorage.getItem('userData') as string;

    (async () => {
      if (lsUserData) {
        const id = JSON.parse(lsUserData)._id;
        const res = await TasksAPI.getTasks(id);
        if (res?.data) {
          setTasks(res.data);
          setSorted(res.data);
        };
      }
    })();
  }, [update]);

  useEffect(() => {
    const today = new Date().getTime();
    const [y, m, d] = new Date().toISOString().slice(0, 10).split('-');

    const completed = sorted.filter((task: ITasks) => task.completed);
    setCompletedTasks(completed);

    const expired = sorted.filter((task: ITasks) => {
      const time = new Date(task.plannedEnd);
      const [yy, mm, dd] = time.toISOString().slice(0, 10).split('-');

      if (time.getTime() < today && (y !== yy || d !== dd || m !== mm) && !task.completed && !task.started) {
        return task;
      }
    });
    setExpiredTasks(expired);

    const planned = sorted.filter((task: ITasks) => {
      const time = new Date(task.plannedEnd);
      const [yy, mm, dd] = time.toISOString().slice(0, 10).split('-');

      if (!(time.getTime() < today && (y !== yy || d !== dd || m !== mm)) && !task.completed && !task.started) {
        return task;
      }
    });
    setPlannedTasks(planned);

    const started = sorted.filter((task: ITasks) => task.started);
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