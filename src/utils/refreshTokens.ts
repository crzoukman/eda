import Api from 'api';
import {
  ApiResponseInterface,
  TokensInterface,
} from 'types';
import { getTokenFromCookie } from './getTokenFromCookie';
import { saveTokenToCookie } from './saveTokenToCookie';

export default async function refreshTokens(
  username: string,
) {
  const token = getTokenFromCookie(username, 'rt');
  const tokens: ApiResponseInterface<TokensInterface> =
    await Api.refreshTokens(token);

  if (tokens.data) {
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
  }

  return tokens;
}
