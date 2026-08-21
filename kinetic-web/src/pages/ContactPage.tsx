import { config } from '../config';
import { ContactView } from '../features/landing';

export function Component() {
  return (
    <>
      <title>{`Contact | ${config.appName}`}</title>
      <ContactView />
    </>
  );
}
