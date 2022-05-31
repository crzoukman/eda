enum TokenTypes {
  at = 'access_token',
  rt = 'refresh_token',
}

export function getTokenFromCookie(
  username: string,
  token_type: 'at' | 'rt',
) {
  const name = TokenTypes[token_type] + '_' + username;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`) as any;
  if (parts.length === 2)
    return parts.pop().split(';').shift();
}
