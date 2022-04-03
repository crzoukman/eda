

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`) as any;
  if (parts.length === 2) return parts.pop().split(';').shift();
}