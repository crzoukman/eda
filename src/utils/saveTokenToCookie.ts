enum TokensEnum {
  at = 'access_token',
  rt = 'refresh_token',
}

export function saveTokenToCookie(
  token: string,
  username: string,
  type: 'at' | 'rt',
) {
  const data = `${TokensEnum[type]}_${username}=${token}`;
  document.cookie = data;
}
