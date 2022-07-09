import Api from 'api';
import Header from 'components/Header';
import Auth from 'pages/Auth';
import Home from 'pages/Home';
import Profile from 'pages/Profile';
import Reg from 'pages/Reg';
import Restore from 'pages/Restore';
import Tasks from 'pages/Tasks';
import {
  createContext,
  FC,
  useEffect,
  useState,
} from 'react';
import { Route, Routes } from 'react-router-dom';
import { IAppContext } from 'types';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { MainWrapperStyled } from './App.styled';
import { Box, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
import refreshTokens from 'utils/refreshTokens';
import { Push2QueueType } from 'Connect';
import { WorkerApi } from 'worker-api';

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

export const AppContext = createContext<IAppContext | null>(
  null,
);

export type Push2QueueFnType = (
  arg: Push2QueueType,
) => void;

interface PropsInterface {
  push2Queue: Push2QueueFnType;
  logout: () => void;
  isAuth: boolean;
  setIsAuth: (arg: boolean) => void;
  lock: boolean;
}

const App: FC<PropsInterface> = ({
  push2Queue,
  logout,
  isAuth,
  setIsAuth,
  lock,
}) => {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (userData) {
      (async () => {
        const username = JSON.parse(userData).username;
        const token = getTokenFromCookie(username, 'at');

        const res = await WorkerApi.checkUser(token);

        if (res.status === 200) {
          console.log(
            '[App.tsx] Пользователь проверен по токену.',
          );
          setIsAuth(true);
        }

        if (res.status === 401) {
          console.log(
            '[App.tsx] Проверка пользователя. Ошибка 401. Попробую обновить токены.',
          );
          const tokens = await refreshTokens(username);

          if (tokens.data) {
            const res = await Api.checkUser(
              tokens.data.access_token,
            );

            if (res.status === 200) {
              console.log(
                '[App.tsx] Токены обновились. Пользователь проверен.',
              );
              setIsAuth(true);
            }

            if (res.status !== 200) {
              console.log(
                '[App.tsx] Токены обновились, но всё равно не удалось проверить пользователя. Выхожу из учётки',
              );
              logout();
            }
          }

          if (tokens.status !== 200) {
            console.log(
              '[App.tsx] Токены не обновились. Выхожу из учётки',
            );
            logout();
          }
        }
      })();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        logout,
        push2Queue,
        lock,
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

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Server is unavailable now
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
            >
              Well?
            </Typography>
            <div>
              <button>No</button>
              <button>Yes</button>
            </div>
          </Box>
        </Modal>
      </div>
    </AppContext.Provider>
  );
};

export default App;
