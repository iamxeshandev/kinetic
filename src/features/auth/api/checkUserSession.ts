export function checkUserSession(): boolean {
  return !!localStorage.getItem('token');
}
