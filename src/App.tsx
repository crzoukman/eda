import Header from 'components/Header';
import Auth from 'pages/Auth';
import Home from 'pages/Home';
import Profile from 'pages/Profile';
import Reg from 'pages/Reg';
import Restore from 'pages/Restore';
import Tasks from 'pages/Tasks';
import { createContext, FC, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { IAppContext } from 'types';
import { MainWrapperStyled } from './App.styled';
require('./middleware/axios');

export const AppContext = createContext<IAppContext | null>(null);


const App: FC = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsAuth(true);
    }
  }, []);


  return (
    <AppContext.Provider value={{
      isAuth,
      setIsAuth,
    }}>
      <div>
        <Header />
        <MainWrapperStyled>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/reg' element={<Reg />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/restore' element={<Restore />} />
            <Route path='/tasks' element={<Tasks />} />
          </Routes>
        </MainWrapperStyled>
      </div>
    </AppContext.Provider>
  );
};

export default App;
