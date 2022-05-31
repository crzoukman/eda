export function getUsernameFromLS() {
  const userData = localStorage.getItem('userData');

  if (!userData) {
    throw new Error(
      'Could not parse data from local storage',
    );
  }

  const parsed = JSON.parse(userData);
  return parsed.username;
}
