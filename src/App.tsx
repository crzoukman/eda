import Api from 'api';
import Header from 'components/Header';
import { config } from 'config';
import RefreshTokenInterceptor from 'interceptor/refreshToken.interceptor';
import Auth from 'pages/Auth';
import Home from 'pages/Home';
import Profile from 'pages/Profile';
import Reg from 'pages/Reg';
import Restore from 'pages/Restore';
import Tasks from 'pages/Tasks';
import {
  createContext,
  FC,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { ApiResponseInterface, IAppContext } from 'types';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { saveTokenToCookie } from 'utils/saveTokenToCookie';
import { MainWrapperStyled } from './App.styled';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext<IAppContext | null>(
  null,
);

export interface QueueInterface {
  id: string;
  name: string;
  fn: any;
  args: any[];
  cb: any;
  merge: boolean;
}

export enum QueueFnList {
  getProfileData = 'getProfileData',
  updateProfile = 'updateProfile',
  checkUser = 'checkUser',
}

const App: FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [checkUserCB, setCheckUserCB] =
    useState<null | ApiResponseInterface>(null);
  const navigate = useNavigate();

  const [queueUpdated, setQueueUpdated] = useState([]);
  const queue = useRef<QueueInterface[]>([]);
  const serverStatus = useRef(true);
  const pingerActive = useRef(false);
  let pingerTimeout: NodeJS.Timeout;

  function pushToQueue(obj: QueueInterface) {
    if (!obj.merge) {
      const filtred = queue.current.filter(
        (item) => item.name !== obj.name,
      );

      queue.current = filtred;
    }

    queue.current.push(obj);
    setQueueUpdated([]);
  }

  useEffect(() => {
    console.log(
      '[queue] Получено обновление очереди: ',
      queue.current,
    );

    const deleteReq = (id: string) => {
      const filtred = queue.current.filter((req) => {
        return req.id !== id;
      });

      queue.current = filtred;
      console.log(
        `[queue] Удалил элемент с номером ${id}. Новая очередь:`,
      );
      console.dir(queue.current);
    };

    function pingerFn() {
      (async function pinger() {
        pingerActive.current = true;
        console.log('[pinger]: Запущен!');

        const res = await Api.pingServer();
        if (res.status === 200) {
          console.log(
            '[pinger]: Пропинговал сервер. Он жив. Изменю флаг на true.',
          );
          serverStatus.current = true;
          pingerActive.current = false;
          forFn();
        }

        if (res.status === 5000) {
          console.log(
            '[pinger]: Пропинговал сервер. Он мёртв. Изменю флаг на false.',
          );
          serverStatus.current = false;
          forFn();

          pingerTimeout = setTimeout(() => {
            pinger();
          }, config.PING_TIMEOUT);
        }
      })();
    }

    if (!pingerActive.current) {
      console.log(
        '[queue] Запущу обёртку пингера. pingerActive: ',
        pingerActive.current,
      );
      pingerFn();
    } else {
      console.log(
        '[queue] Пингер уже запущен. Игнорирую запуск обёртки. pingerActive: ',
        pingerActive.current,
      );
    }

    async function forFn() {
      console.log(
        '[queue:] Цикл for готов стартануть. Состояние serverStatus: ',
        serverStatus.current,
      );

      for (const req of queue.current) {
        if (serverStatus.current === true) {
          console.log(
            '[queue]: Флаг сервера: ',
            serverStatus.current,
          );
          console.log(
            '[queue]: Идёт обработка запроса: ',
            req,
          );

          const res = await req.fn(...req.args);

          console.log(
            '[queue]: Получен ответ от запроса: ',
            req,
          );
          console.log('[queue]: И сам ответ: ', res);

          if (res.status === 200) {
            console.log(
              '[queue]: Ответ 200. Используем коллбэк, чтобы вернуть результат. Удаляем запрос. Переходим к след. итерации.',
            );
            req.cb(res);
            deleteReq(req.id);
            continue;
          }

          if (res.status === 401) {
            console.log(
              '[queue]: Ответ 401. Будем обновлять токен используя рефреш токен.',
            );
            const username = getUsernameFromLS();
            const token = getTokenFromCookie(
              username,
              'rt',
            );

            const tokens = await Api.refreshTokens(token);

            if (tokens.status === 200) {
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

              console.log(
                '[queue]: Замена токенов прошла успешно. Повторяем вызов запроса.',
              );

              const res = await req.fn(...req.args);

              if (res.status === 200) {
                console.log(
                  '[queue]: Ответ 200 на повторный вызов.',
                );
                req.cb(res);
                deleteReq(req.id);
                continue;
              }

              if (res.status !== 200) {
                console.log(
                  '[queue]: Повторный запрос провалился с новыми токенами. ВТФ. Переход к след. итерации.',
                  res,
                );
                continue;
              }
            }

            if (tokens.status !== 200) {
              console.log(
                'Токены обновить не удалось. Обнуляю очередь. Выхожу из учётки. Ломаю цикл.',
              );
              queue.current = [];
              logout();
              break;
            }
          }

          if (res.status === 5000) {
            console.log(
              '[queue]: Север не отвечает. Отдадим ответ. Поменяем serverStatus на false. Сюда не должно было дойти!!!',
            );
            req.cb(res);
            serverStatus.current = false;
          }

          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        }

        if (serverStatus.current === false) {
          console.log(
            '[queue]: Флаг сервера false. Реджектим запрос с 5000 ошибкой.',
            req,
          );

          console.log(
            '[queue]: Текущая очередь после реджекта: ',
            queue.current,
          );
          req.cb({ status: 5000 });
        }
      }
    }
  }, [queueUpdated]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const checkUser = async () => {
        const username = JSON.parse(userData).username;
        const token = getTokenFromCookie(username, 'at');

        const res = await Api.checkUser(token);

        return res;
      };

      pushToQueue({
        id: uuidv4(),
        name: QueueFnList.checkUser,
        fn: checkUser,
        args: [],
        cb: setCheckUserCB,
        merge: false,
      });
    }

    const clearPingerTimeout = () => {
      clearTimeout(pingerTimeout);
    };

    window.addEventListener(
      'beforeunload',
      clearPingerTimeout,
    );

    return () => {
      window.removeEventListener(
        'beforeunload',
        clearPingerTimeout,
      );
    };
  }, []);

  useEffect(() => {
    if (checkUserCB) {
      if (checkUserCB.status === 200) {
        setIsAuth(true);
        console.log('[checkUserApi]: ', checkUserCB.data);
        setCheckUserCB(null);
      } else {
        logout();
      }
    }
  }, [checkUserCB]);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('userData');
    navigate('/auth');
  };

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        logout,
        queue,
        setQueueUpdated,
        QueueFnList,
        pushToQueue,
      }}
    >
      <div>
        <Header />
        <MainWrapperStyled>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reg" element={<Reg />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/restore" element={<Restore />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </MainWrapperStyled>
        {/* <RefreshTokenInterceptor /> */}
      </div>
    </AppContext.Provider>
  );
};

export default App;
