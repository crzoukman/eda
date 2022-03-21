import { ITasks } from "pages/Tasks/types";
import { useEffect, useState } from "react";

interface IProps {
  tasks: ITasks[];
  setSorted: (arg: ITasks[]) => void;
}

const useFilters = (args: IProps) => {
  const [taskName, setTaskName] = useState('');
  const [type, setType] = useState('All');
  const [plannedStart, setPlannedStart] = useState<Date | null>(null);
  const [plannedEnd, setPlannedEnd] = useState<Date | null>(null);
  const [started, setStarted] = useState<Date | null>(null);
  const [ended, setEnded] = useState<Date | null>(null);
  const [completed, setCompleted] = useState(false);

  const { tasks, setSorted } = args;

  useEffect(() => {
    const byTaskName = tasks.filter(task => task.name.toLowerCase().includes(taskName.toLowerCase()));
    const byType = byTaskName.filter(task => type === 'All' ? task : task.type === type);
    const byPlannedStart = byType.filter(task => {
      if (plannedStart === null) {
        return task;
      }

      const pickedISO = plannedStart.toISOString().slice(0, 10);
      const plannedISO = new Date(task.plannedStart).toISOString().slice(0, 10);

      if (task.plannedStart) {
        return pickedISO === plannedISO;
      }

      return task;
    });

    const byPlannedEnd = byPlannedStart.filter(task => {
      if (plannedEnd === null) {
        return task;
      }

      const pickedISO = plannedEnd.toISOString().slice(0, 10);
      const plannedISO = new Date(task.plannedEnd).toISOString().slice(0, 10);

      if (task.plannedEnd) {
        return pickedISO === plannedISO;
      }

      return task;
    });

    const byStarted = byPlannedEnd.filter(task => {
      if (started === null) {
        return task;
      }

      if (!task.startedTime) return false;

      const pickedISO = started.toISOString().slice(0, 10);
      const plannedISO = new Date(task.startedTime).toISOString().slice(0, 10);

      if (task.startedTime) {
        return pickedISO === plannedISO;
      }

      return task;
    });

    const byEnded = byStarted.filter(task => {
      if (ended === null) {
        return task;
      }

      if (!task.endedTime) return false;

      const pickedISO = ended.toISOString().slice(0, 10);
      const plannedISO = new Date(task.endedTime).toISOString().slice(0, 10);

      if (task.endedTime) {
        return pickedISO === plannedISO;
      }

      return task;
    });

    const byCompleted = byEnded.filter(task => completed ? task.completed : task);

    const result = byCompleted;
    setSorted(result)
  }, [taskName, type, plannedStart, plannedEnd, started, ended, completed]);

  return [
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
  ];
};

export default useFilters;