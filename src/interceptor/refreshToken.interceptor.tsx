import Api from 'api';
import { BASE_URL } from 'api/baseURL';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { FC, useEffect } from 'react';
import { getTokenFromCookie } from 'utils/getTokenFromCookie';
import { getUsernameFromLS } from 'utils/getUsernameFromLS';
import { saveTokenToCookie } from 'utils/saveTokenToCookie';

const responseUrlList = [`${BASE_URL}/api/users`];

const refreshTokensUrl = `${BASE_URL}/api/auth/refresh-tokens`;

const RefreshTokenInterceptor: FC = () => {
  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        const responseUrl = response.request.responseURL;

        if (refreshTokensUrl === responseUrl) {
          console.log(
            '[interceptor]: Успешная попытка обновить токены. Токены пришли и будут записаны в куки',
          );

          const username = getUsernameFromLS();

          saveTokenToCookie(
            response.data.access_token,
            username,
            'at',
          );
          saveTokenToCookie(
            response.data.refresh_token,
            username,
            'rt',
          );
        }

        return response;
      },
      async function (error: AxiosError) {
        if (!error.response) {
          console.log('[interceptor]: Вообще нет ответа!');
          return Promise.reject(error);
        }

        const responseUrl =
          error.response?.request.responseURL;

        if (responseUrlList.includes(responseUrl)) {
          console.log(
            '[interceptor]: Вернулась ошибка по запросу, за которыми мы следим по URL',
          );

          if (error.response?.status === 401) {
            console.log(
              '[interceptor]: Код ошибки 401. Попытаюсь обновить токены используя рефреш токен',
            );
            const username = getUsernameFromLS();
            const token = getTokenFromCookie(
              username,
              'rt',
            );

            await Api.refreshTokens(token);
          }
        }

        if (
          refreshTokensUrl ===
          error.response?.request.responseURL
        ) {
          if (error.response?.status === 401) {
            console.log(
              '[interceptor]: Вернулась ошибка. Попытка обновить токены используя рефреш токен не удалась',
            );
          }
        }

        return Promise.reject(error);
      },
    );
  }, []);

  return <></>;
};

export default RefreshTokenInterceptor;
