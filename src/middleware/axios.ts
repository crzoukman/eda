import { BASE_URL } from "api/baseURL";
import axios from "axios";
import { getCookie } from "utils/getCookie";

export default axios.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  if (error.response.status === 403) {
    const userData = JSON.parse(localStorage.getItem('userData') as string);
    const token = getCookie('refreshToken' + userData._id);

    const newToken = await axios.get(BASE_URL + '/api/tasks/refresh', {
      headers: {
        'x-refresh': `${token}`
      }
    });

    document.cookie = `accessToken${userData._id}=${newToken.data.accessToken}`;
    return { status: 403 };
  }
  return Promise.reject(error);
});