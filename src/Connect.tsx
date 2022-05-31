import Api from 'api';
import App from 'App';
import { FC, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { config } from 'config';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { saveTokenToCookie } from 'utils/saveTokenToCookie';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const progressStyles = {
  position: 'absolute' as 'absolute',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  backgroundColor: 'black',
  opacity: 0.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export interface QueueInterface {
  id: string;
  name: string;
  fn: any;
  cb: any;
  processOnlyLast: boolean;
  identifier: string | null;
}

export type Push2QueueType = {
  name: string;
  fn: any;
  cb: any;
  processOnlyLast?: boolean;
  identifier?: string | null;
};

export enum RequestNameList {
  updateProfile = 'updateProfile',
  getProfileData = 'getProfileData',
  getTasks = 'getTasks',
  startTask = 'startTask',
  completeTask = 'completeTask',
  deleteTask = 'deleteTask',
  editTask = 'editTask',
  addTask = 'addTask',
}

const Connect: FC = () => {
  const [_, queueUpdated] = useState([]);
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const [lock, setLock] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    modalAnswerHandler(false);
    setOpen(false);
  };

  const queue = useRef<QueueInterface[]>([]);
  const requests2Process = useRef<string[]>([]);
  const shouldNotBeProcess = useRef<string[]>([]);
  const serverStatus = useRef<boolean>(true);
  const isPinging = useRef<boolean>(false);
  const timeoutId = useRef<null | NodeJS.Timeout>(null);
  // const lock = useRef<boolean>(false);

  function push2Queue(data: Push2QueueType) {
    const id = uuid();
    const req = {
      id,
      processOnlyLast: false,
      identifier: null,
      ...data,
    };

    if (req.processOnlyLast) {
      const filtred = queue.current.filter((request) => {
        return request.name !== req.name;
      });

      if (filtred.length === queue.current.length) {
        console.log(
          '[Connect.tsx] Длина массивов равна. Первый запрос. Уведомлю.',
        );
        queue.current.push(req);
        queueUpdated([]);
      } else {
        console.log(
          '[Connect.tsx] Длина массивов разная. Удалю всё, кроме последнего. Не буду уведомлять.',
        );
        queue.current = filtred;
        queue.current.push(req);
      }
    } else {
      if (req.identifier) {
        const filtred = queue.current.filter((request) => {
          return request.identifier !== req.identifier;
        });

        if (filtred.length === queue.current.length) {
          console.log(
            '[Connect.tsx] Длина массивов равна. Первый запрос. Уведомлю.',
          );
          queue.current.push(req);
          queueUpdated([]);
        } else {
          console.log(
            '[Connect.tsx] Длина массивов разная. Удалю всё, кроме последнего. Не буду уведомлять.',
          );
          queue.current = filtred;
          queue.current.push(req);
        }
      }
    }
  }

  async function pingServer() {
    const res = await Api.pingServer();

    return res.status;
  }

  async function pinger() {
    const res = await pingServer();

    if (res !== 5000) {
      console.log(
        '[Connect.tsx] Пингер получил ответ. Отключаю пингер. Обработаю очередь: ',
        queue.current,
      );

      queueProcesser();

      serverStatus.current = true;
      isPinging.current = false;
      timeoutId.current = null;
      shouldNotBeProcess.current = [];
      requests2Process.current = [];
    } else {
      console.log(
        '[Connect.tsx] Пингер не получил ответ. Вызываю пингер через рекурсию.',
      );

      timeoutId.current = setTimeout(async () => {
        console.log('[Connect.tsx] Пинг...');
        pinger();
      }, config.PING_TIMEOUT);
    }
  }

  function modalAnswerHandler(arg: boolean) {
    const length = queue.current.length;
    const last = queue.current[length - 1];

    if (arg) {
      console.log(
        '[Connect.tsx] Ответ от модалки TRUE. Верну ответ с 5000 ошибкой.',
      );

      if (last.processOnlyLast) {
        console.log(
          '[Connect.tsx] Запрос с флагом processOnlyLast. Добавлю тип запроса в request-очередь: ',
          requests2Process.current,
        );
        requests2Process.current.push(last.name);
      }

      last.cb({ status: 5000 });
      setOpen(false);

      console.log('[Connect.tsx] Очередь: ', queue.current);

      if (isPinging.current === false) {
        console.log(
          '[Connect.tsx] Пингер сейчас не работает.',
        );

        if (serverStatus.current === false) {
          console.log(
            '[Connect.tsx] Сервер упал. Запускаю пингер.',
          );

          isPinging.current = true;
          pinger();
        }
      }
    } else {
      console.log(
        '[Connect.tsx] Ответ от модалки FALSE. Отсылаю 5000 ответ последнему запросу в очереди. Исключаю запрос из очереди. Добавлю имя запроса в список shouldNotBeProcess',
      );

      const included = last.identifier
        ? last.identifier
        : last.name;

      shouldNotBeProcess.current.push(included);

      const lastx = queue.current.pop() as QueueInterface;
      lastx.cb({ status: 5000 });
      setOpen(false);
    }
  }

  async function queueProcesser() {
    for (const req of queue.current) {
      const res = await req.fn();

      if (res.status === 200) {
        req.cb(res);
      } else if (res.status === 401) {
        console.log(
          '[Connect.tsx] При обработке очереди возникла ошибка 401. Попробую обновить токены и сделать повторный запрос.',
        );

        const username = getUsernameFromLS();
        const token = getTokenFromCookie(username, 'rt');
        const tokens = await Api.refreshTokens(token);

        if (tokens.status === 200 && tokens.data) {
          console.log(
            '[Connect.tsx] Новые токены сохранены в ЛС. Пробую повторить запрос.',
          );

          saveTokenToCookie(
            tokens.data.access_token,
            username,
            'at',
          );
          saveTokenToCookie(
            tokens.data.refresh_token,
            username,
            'rt',
          );

          const res = await req.fn();

          if (res.status === 200) {
            req.cb(res);
          } else {
            console.log(
              '[Connect.tsx] Токены обновились, но запрос не удался. WTF?',
            );
          }
        } else {
          console.log(
            '[Connect.tsx] Не удалось обновить токены. Выхожу из учётки.',
          );

          logout();
        }
      } else if (res.status === 404) {
        console.log(
          '[Connect.tsx] Не найдена сущность. Ничего не делать.',
        );
      } else {
        console.log(
          '[Connect.tsx] Какая-то ошибка при обработке запроса. WTF. Выхожу из учётки. Oшибка: ',
          res,
        );

        logout();
      }
    }

    console.log(
      '[Connect.tsx] Очередь обработана. Очищу очередь.',
    );

    queue.current = [];
  }

  useEffect(() => {
    if (queue.current.length > 0) {
      (async () => {
        console.log(
          '[Connect.tsx] Добавлен запрос в очередь. Проверю состояние сервера.',
        );

        let res: any;

        if (isPinging.current || !serverStatus.current) {
          res = 5000;
        } else {
          setLock(true);
          res = await pingServer();
          setLock(false);
        }

        if (res === 5000) {
          console.log('[Connect.tsx] Сервер не отвечает!');

          serverStatus.current = false;
          const length = queue.current.length;
          const last = queue.current[length - 1];
          const included = last.identifier
            ? last.identifier
            : last.name;

          if (
            shouldNotBeProcess.current.includes(included)
          ) {
            console.log(
              '[Connect.tsx] Имя запроса присутствует в списке shouldNotBeProcess. Исключу его из очереди, дам 5000 ответ. Ничего не буду делать.',
            );

            last.cb({ status: 5000 });
            queue.current.pop();
          } else {
            console.log(
              '[Connect.tsx] Имя запроса отсутствует в списке shouldNotBeProcess. Продолжу.',
            );

            if (last.processOnlyLast) {
              console.log(
                '[Connect.tsx] Запрос имеет флаг processOnlyLast равным TRUE. Проверю, если ли тип запроса в request-очереди.',
              );

              const included =
                requests2Process.current.includes(
                  last.name,
                );

              if (included) {
                console.log(
                  '[Connect.tsx] Тип запроса содержится в request-очереди. Удалю из очереди все похожие запросы, кроме последнего.',
                );
                const filtred = queue.current.filter(
                  (res) => {
                    return res.name !== last.name;
                  },
                );
                queue.current = filtred;
                last.processOnlyLast = true;
                queue.current.push(last);

                console.log(
                  '[Connect.tsx] Верну 5000 в последнем запросе. Очередь: ',
                  queue.current,
                );

                last.cb({ status: 5000 });
              } else {
                console.log(
                  '[Connect.tsx] Тип запроса отсутствует в request-очереди. Открою модалку.',
                );
                setOpen(true);
              }
            } else {
              console.log(
                '[Connect.tsx] Запрос имеет флаг processOnlyLast равным FALSE.',
              );

              if (last.identifier) {
                console.log(
                  '[Connect.tsx] Имеется индефикатор. Удалю все запросы с таким индефикатором, кроме последнего. Очередь: ',
                  queue.current,
                );
                const filtred = queue.current.filter(
                  (req) => {
                    return (
                      last.identifier !== req.identifier
                    );
                  },
                );
                const flag =
                  queue.current.length - filtred.length;
                queue.current = filtred;
                queue.current.push(last);

                if (flag > 1) {
                  console.log(
                    '[Connect.tsx] Разница в длине между queue & filtred > 1. Запрос с данным индефикатором не первый.',
                  );
                } else {
                  console.log(
                    '[Connect.tsx] Разница в длине между queue & filtred < 1. Запрос с данным индефикатором первый. Открою модалку.',
                  );
                  setOpen(true);
                }

                console.log(
                  '[Connect.tsx] Очередь после удаления: ',
                  queue.current,
                );
              } else {
                console.log(
                  '[Connect.tsx] Запрос не имеет индефикатор. Хз что делать...',
                );
              }
            }
          }
        }

        if (res === 200) {
          console.log(
            '[Connect.tsx] Сервер живой. Обработаю очередь.',
          );

          queueProcesser();
        }
      })();
    }
  }, [_]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  function logout() {
    setIsAuth(false);
    localStorage.removeItem('userData');
    navigate('/auth');
  }

  return (
    <>
      <App
        push2Queue={push2Queue}
        logout={logout}
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        lock={lock}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Server does not response!
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            I can process the request{' '}
            <span
              style={{
                color: 'lightblue',
                fontSize: '20px',
              }}
            >
              {
                queue.current[queue.current.length - 1]
                  ?.name
              }
            </span>{' '}
            when the connection is restored. Would you like
            it?
          </Typography>
          <div>
            <button
              onClick={() => modalAnswerHandler(false)}
            >
              NO
            </button>
            <button
              onClick={() => modalAnswerHandler(true)}
            >
              YES
            </button>
          </div>
        </Box>
      </Modal>

      {/* {lock && (
        <div style={progressStyles}>
          <Box
            sx={{
              width: '75%',
              padding: '20px 40px',
              background: 'white',
            }}
          >
            <LinearProgress />
          </Box>
        </div>
      )} */}
    </>
  );
};

export default Connect;
