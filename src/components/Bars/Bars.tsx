import { FC, useEffect, useState } from 'react';
import { TaskInterface } from 'types';
import { BarsStyled, BarStyled } from './Bars.styled';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

interface IProps {
  tasks: Required<TaskInterface & { color: string }>[];
}

const Bars: FC<IProps> = ({ tasks }) => {
  const [filtred, setFiltred] = useState<
    [] | Required<TaskInterface & { color: string }>[]
  >([]);

  useEffect(() => {
    const now = new Date().toISOString().split('T')[0];
    const filtredByStarting = tasks.filter((task) => {
      const plannedStart = task.plannedStart as Date;

      return String(plannedStart).split('T')[0] === now;
    });

    const last = filtredByStarting.reverse().slice(0, 5);

    const dateNow = dayjs(now);

    last.map((task) => {
      const datePlanned = dayjs(task.plannedEnd);
      const gap = Math.floor(
        datePlanned.diff(dateNow) / 1000 / 60 / 60 / 24,
      );

      if (gap === 0) return (task.color = 'darkred');
      if (gap === 1) return (task.color = 'red');
      if (gap === 2) return (task.color = 'darkorange');
      if (gap === 3) return (task.color = 'orange');
      if (gap === 4) return (task.color = 'greenyellow');
      if (gap === 5) return (task.color = 'DarkMagenta');
      if (gap === 6) return (task.color = 'DarkOrchid');
      if (gap >= 7 && gap <= 13)
        return (task.color = 'green');
      if (gap >= 14) return (task.color = 'aqua');
    });

    setFiltred(last);
  }, [tasks]);

  return (
    <AnimatePresence>
      {filtred.length ? (
        <BarsStyled as={motion.div} key="barsStyled">
          <AnimatePresence>
            {filtred.map((task) => (
              <BarStyled
                as={motion.div}
                color={task.color}
                completed={task.completed ? 1 : 0.3}
                key={task.id}
                initial={{
                  x: '-150%',
                  opacity: task.completed ? 0.3 : 0.3,
                }}
                animate={{
                  x: 0,
                  opacity: task.completed ? 1 : 0.3,
                }}
                exit={{
                  x: '150%',
                }}
              />
            ))}
          </AnimatePresence>
        </BarsStyled>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
};

export default Bars;
