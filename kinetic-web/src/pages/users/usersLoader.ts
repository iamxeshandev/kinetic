import { redirect } from 'react-router';
import { CONFIG } from '../../config';
import { paths } from '../../routes';

export function usersLoader() {
  const json = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
  const isPersonal = json ? JSON.parse(json).currentWorkspace.isPersonal : true;
  if (isPersonal) throw redirect(paths.notFound);
}

export { usersLoader as loader };
