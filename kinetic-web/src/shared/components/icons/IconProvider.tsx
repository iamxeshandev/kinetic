import { IconContext } from 'react-icons/lib';

export function IconProvider({ children }: { children: React.ReactNode }) {
  return <IconContext.Provider value={{}}>{children}</IconContext.Provider>;
}
